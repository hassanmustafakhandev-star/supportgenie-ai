from fastapi import Request, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    Verify the Firebase ID token in the authorization header.
    Returns the user_id (uid) if valid.
    """
    token = credentials.credentials
    try:
        # Avoid checking if app is initialized here if possible, handle in main.py
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise ValueError("Token does not contain a UID.")
        return uid
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Dependency wrapper, or use directly in route
def get_current_user_id(uid: str = Security(verify_firebase_token)) -> str:
    return uid
