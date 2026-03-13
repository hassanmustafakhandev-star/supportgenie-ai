from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional
import uuid
from datetime import datetime

from models.schemas import ChatRequest, ChatResponse, ChatMessage
from db.firestore_client import firestore_db
from services.rag_service import rag_service

router = APIRouter()


def _check_usage_limit(user_id: str) -> bool:
    user = firestore_db.get_user(user_id)
    if not user:
        # If user not found in DB, allow (they might not be synced yet but bot exists)
        return True

    plan = user.get('plan', 'Free')
    limits = {'Free': 100, 'Pro': 5000, 'Enterprise': float('inf')}
    max_messages = limits.get(plan, 100)

    current_month = datetime.utcnow().strftime('%Y-%m')
    usage = firestore_db.get_usage(user_id, current_month)

    if usage and usage.get('messageCount', 0) >= max_messages:
        return False
    return True


@router.post("/", response_model=ChatResponse)
def send_chat_message(request: ChatRequest, x_chat_id: Optional[str] = Header(None)):
    """
    Public Endpoint for bot interaction. No authentication required — uses Bot ID.
    Pass x-chat-id header to continue a conversation, otherwise a new chat starts.
    """
    bot = firestore_db.get_bot(request.botId)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")

    user_id = bot.get('userId', '')

    # Check usage limit
    if not _check_usage_limit(user_id):
        raise HTTPException(
            status_code=429,
            detail="Usage limit exceeded for this bot's plan"
        )

    chat_id = x_chat_id
    if not chat_id:
        chat_id = f"chat_{uuid.uuid4().hex[:12]}"
        firestore_db.create_chat(chat_id, request.botId)

    # Get existing history
    history_docs = firestore_db.get_chat_history(chat_id)

    # Save user message
    firestore_db.add_message(chat_id, "user", request.message)

    # Generate answer using RAG pipeline
    answer = rag_service.generate_answer(
        bot_id=request.botId,
        query=request.message,
        chat_history=history_docs
    )

    # Save assistant message
    firestore_db.add_message(chat_id, "assistant", answer)

    # Update usage tracking
    current_month = datetime.utcnow().strftime('%Y-%m')
    approx_tokens = (len(request.message) + len(answer)) // 4
    firestore_db.increment_usage(user_id, approx_tokens, current_month)

    # Return response with chat_id so frontend can continue conversation
    return ChatResponse(answer=answer, chatId=chat_id)


@router.get("/{bot_id}/history")
def get_bot_chats(bot_id: str):
    """Get all chat sessions for a bot."""
    chats = firestore_db.get_bot_chats(bot_id)
    return {"chats": chats}


@router.get("/{bot_id}/history/{chat_id}")
def fetch_chat_history(bot_id: str, chat_id: str):
    """Get the full message history of a given chat session."""
    history = firestore_db.get_chat_history(chat_id)
    return {"history": history}


@router.get("/{bot_id}/details")
def get_public_bot_details(bot_id: str):
    """Public endpoint to get bot name/branding for the widget."""
    bot = firestore_db.get_bot(bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return {
        "id": bot_id,
        "name": bot.get("name"),
        "businessName": bot.get("businessName"),
        "tone": bot.get("tone")
    }
