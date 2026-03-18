from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, bots, upload, chat, analytics
import firebase_admin
from firebase_admin import credentials
from config.settings import get_settings

app = FastAPI(title="SupportGenie AI Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you should set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin early
settings = get_settings()
try:
    if not firebase_admin._apps:
        # Clean up environment variables (remove stray quotes)
        project_id = settings.FIREBASE_PROJECT_ID.strip('"').strip("'")
        private_key = settings.FIREBASE_PRIVATE_KEY.strip('"').strip("'").replace('\\n', '\n')
        client_email = settings.FIREBASE_CLIENT_EMAIL.strip('"').strip("'")
        
        print(f"INFO: Initializing Firebase for project: {project_id}")
        
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": project_id,
            "private_key": private_key,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        firebase_admin.initialize_app(cred)
        print("SUCCESS: Firebase Admin initialized successfully.")
except Exception as e:
    print(f"CRITICAL: Firebase Initialization failed: {e}")
    # Don't let the app crash here, but it will fail on firestore calls


from fastapi.staticfiles import StaticFiles
import os

# Create static dir if not exists
os.makedirs("static", exist_ok=True)

app.mount("/widget", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "SupportGenie AI Backend is running"}

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(bots.router, prefix="/api/bots", tags=["Bots"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

