from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query, BackgroundTasks
import uuid
from workers.training_worker import process_document_logic
from db.firestore_client import firestore_db
from services.pdf_service import pdf_service
from services.scraper_service import scraper_service
from models.schemas import WebsiteUpload, FAQUpload, DocumentUploadResponse
from utils.auth_middleware import get_current_user_id

router = APIRouter()


def _verify_bot_ownership(bot_id: str, user_id: str) -> dict:
    bot = firestore_db.get_bot(bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    if bot.get('userId') != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this bot")
    return bot


@router.post("/pdf", response_model=DocumentUploadResponse)
async def upload_pdf(
    background_tasks: BackgroundTasks,
    botId: str = Form(...),
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """Upload a PDF file for processing."""
    bot = _verify_bot_ownership(botId, user_id)

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    contents = await file.read()
    text = pdf_service.extract_text(contents)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    doc_id = f"doc_{uuid.uuid4().hex[:12]}"
    doc_data = {
        "id": doc_id,
        "botId": botId,
        "fileName": file.filename,
        "type": "pdf",
        "status": "processing"
    }

    firestore_db.add_document(doc_data)

    # Send to FastAPI background worker for async processing (No Redis needed)
    background_tasks.add_task(
        process_document_logic,
        doc_id=doc_id,
        bot_id=botId,
        text=text,
        source_name=file.filename,
        namespace=bot.get('namespace', botId)
    )

    return doc_data


@router.post("/website", response_model=DocumentUploadResponse)
async def upload_website(
    payload: WebsiteUpload,
    background_tasks: BackgroundTasks,
    botId: str = Query(...),
    user_id: str = Depends(get_current_user_id)
):
    """Submit a website URL for scraping and processing."""
    bot = _verify_bot_ownership(botId, user_id)

    try:
        text = scraper_service.extract_text(payload.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal scraper error: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from website")

    doc_id = f"doc_{uuid.uuid4().hex[:12]}"
    doc_data = {
        "id": doc_id,
        "botId": botId,
        "fileName": payload.url,
        "type": "website",
        "status": "processing"
    }

    firestore_db.add_document(doc_data)

    background_tasks.add_task(
        process_document_logic,
        doc_id=doc_id,
        bot_id=botId,
        text=text,
        source_name=payload.url,
        namespace=bot.get('namespace', botId)
    )

    return doc_data


@router.post("/faq", response_model=DocumentUploadResponse)
async def upload_faq(
    payload: FAQUpload,
    background_tasks: BackgroundTasks,
    botId: str = Query(...),
    user_id: str = Depends(get_current_user_id)
):
    """Submit FAQ text for processing."""
    bot = _verify_bot_ownership(botId, user_id)

    text = payload.text
    if not text.strip():
        raise HTTPException(status_code=400, detail="FAQ text cannot be empty")

    doc_id = f"doc_{uuid.uuid4().hex[:12]}"
    doc_data = {
        "id": doc_id,
        "botId": botId,
        "fileName": "Raw FAQ Text",
        "type": "faq",
        "status": "processing"
    }

    firestore_db.add_document(doc_data)

    background_tasks.add_task(
        process_document_logic,
        doc_id=doc_id,
        bot_id=botId,
        text=text,
        source_name="Raw FAQ",
        namespace=bot.get('namespace', botId)
    )

    return doc_data
