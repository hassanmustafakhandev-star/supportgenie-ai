from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


# --- User ---
class UserBase(BaseModel):
    id: str
    name: Optional[str] = None
    email: str
    plan: Literal["Free", "Pro", "Enterprise"] = "Free"


# --- Bot ---
class BotCreate(BaseModel):
    name: str = Field(..., max_length=100)
    businessName: str = Field(..., max_length=100)
    tone: Literal["professional", "friendly", "humorous", "strict"] = "professional"


class BotResponse(BotCreate):
    id: str
    userId: str
    namespace: str
    createdAt: str  # ISO string from Firestore


# --- Document ---
class DocumentUploadResponse(BaseModel):
    id: str
    botId: str
    fileName: str
    type: Literal["pdf", "website", "faq"]
    status: Literal["processing", "completed", "failed"] = "processing"


class WebsiteUpload(BaseModel):
    url: str


class FAQUpload(BaseModel):
    text: str


# --- Chat ---
class ChatMessage(BaseModel):
    id: Optional[str] = None
    chatId: Optional[str] = None
    role: Literal["user", "assistant"]
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    botId: str
    message: str


class ChatResponse(BaseModel):
    answer: str
    chatId: str = ""


# --- Usage/Analytics ---
class UsageStats(BaseModel):
    userId: str
    month: str
    messageCount: int
    tokenUsage: int
