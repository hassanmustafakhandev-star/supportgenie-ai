from PyPDF2 import PdfReader
from fastapi import UploadFile
import io
import tempfile

class PDFService:
    @staticmethod
    def extract_text(file_content: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""

pdf_service = PDFService()
