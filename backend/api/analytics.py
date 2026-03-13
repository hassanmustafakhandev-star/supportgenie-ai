from fastapi import APIRouter, Depends, HTTPException
from db.firestore_client import firestore_db
from utils.auth_middleware import get_current_user_id
from datetime import datetime

router = APIRouter()

@router.get("/")
def get_analytics(user_id: str = Depends(get_current_user_id)):
    """Returns analytics/usage stats for the current user for the current month."""
    current_month = datetime.utcnow().strftime('%Y-%m')
    usage = firestore_db.get_usage(user_id, current_month)
    
    # Also we might want to return bot stats
    bots = firestore_db.get_user_bots(user_id)
    bot_count = len(bots)
    
    return {
        "userId": user_id,
        "month": current_month,
        "messageCount": usage.get('messageCount', 0) if usage else 0,
        "tokenUsage": usage.get('tokenUsage', 0) if usage else 0,
        "totalBots": bot_count
    }
