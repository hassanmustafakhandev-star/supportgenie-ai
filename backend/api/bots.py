from fastapi import APIRouter, Depends, HTTPException
from typing import List
import uuid
from datetime import datetime

from models.schemas import BotCreate, BotResponse
from db.firestore_client import firestore_db
from db.pinecone_client import pinecone_db
from utils.auth_middleware import get_current_user_id

router = APIRouter()


@router.get("/")
def get_bots(user_id: str = Depends(get_current_user_id)):
    """Return all bots for the authenticated user."""
    bots = firestore_db.get_user_bots(user_id)
    return {"bots": bots}


@router.post("/", response_model=BotResponse)
def create_bot(bot_req: BotCreate, user_id: str = Depends(get_current_user_id)):
    """Create a new chatbot."""
    bot_id = f"bot_{uuid.uuid4().hex[:12]}"
    namespace = f"ns_{bot_id}"

    bot_data = {
        "id": bot_id,
        "userId": user_id,
        "name": bot_req.name,
        "businessName": bot_req.businessName,
        "tone": bot_req.tone,
        "namespace": namespace,
        "createdAt": datetime.utcnow().isoformat()
    }

    created = firestore_db.create_bot(bot_id, bot_data)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create bot")

    return bot_data


@router.get("/{bot_id}")
def get_bot(bot_id: str, user_id: str = Depends(get_current_user_id)):
    """Get a specific bot by ID."""
    bot = firestore_db.get_bot(bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return bot


@router.get("/{bot_id}/documents")
def get_bot_documents(bot_id: str, user_id: str = Depends(get_current_user_id)):
    """Get all documents for a specific bot."""
    bot = firestore_db.get_bot(bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    docs = firestore_db.get_bot_documents(bot_id)
    return {"documents": docs}


@router.delete("/{bot_id}/documents/{doc_id}")
def delete_bot_document(bot_id: str, doc_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a specific document and its vectors."""
    bot = firestore_db.get_bot(bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # 1. Delete vectors from Pinecone
    namespace = bot.get('namespace', bot_id)
    from db.pinecone_client import pinecone_db
    pinecone_db.delete_vectors_by_doc_id(namespace, doc_id)

    # 2. Delete from Firestore
    firestore_db.delete_document(doc_id)

    return {"status": "success", "message": "Document deleted"}


@router.delete("/{bot_id}")
def delete_bot(bot_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a bot and all its associated vectors."""
    bot = firestore_db.get_bot(bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.get("userId") != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Delete from Firestore
    firestore_db.delete_bot(bot_id)

    # Delete vectors from Pinecone namespace
    namespace = bot.get('namespace', bot_id)
    pinecone_db.delete_namespace(namespace)

    return {"status": "success", "message": "Bot deleted"}
