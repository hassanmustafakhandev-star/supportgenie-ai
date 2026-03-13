from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
import hashlib
import tempfile
import os

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)

def chunk_text(text: str, source: str) -> List[Dict[str, Any]]:
    """
    Split text into chunks and format for Pinecone
    """
    chunks = text_splitter.split_text(text)
    formatted_chunks = []
    
    for i, chunk in enumerate(chunks):
        chunk_id = hashlib.md5(f"{source}_{i}".encode()).hexdigest()
        formatted_chunks.append({
            "id": chunk_id,
            "text": chunk,
            "source": source
        })
    
    return formatted_chunks
