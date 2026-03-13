from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from db.firestore_client import firestore_db
from utils.auth_middleware import get_current_user_id

router = APIRouter()


class VerifyRequest(BaseModel):
    name: Optional[str] = None
    email: str


@router.post("/verify")
def verify_auth(payload: VerifyRequest, user_id: str = Depends(get_current_user_id)):
    """
    Called by frontend after Firebase sign in to sync user to our Firestore DB.
    The user_id comes from the verified Firebase token.
    """
    user_data = {
        'name': payload.name or '',
        'email': payload.email,
        'plan': 'Free',  # Default plan for new users
    }

    created_user = firestore_db.create_or_update_user(user_id, user_data)
    if not created_user:
        raise HTTPException(status_code=500, detail="Failed to sync user")

    return {"status": "success", "user": created_user}
