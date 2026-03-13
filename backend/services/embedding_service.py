from langchain_community.embeddings import HuggingFaceEmbeddings
from config.settings import get_settings
from typing import List


class EmbeddingService:
    def __init__(self):
        self._embeddings = None

    def _init(self):
        """Lazy initialization to avoid crashing at import time."""
        if self._embeddings is not None:
            return
        try:
            self._embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
        except Exception as e:
            print(f"Failed to initialize HuggingFace Embeddings: {e}")
            self._embeddings = None

    @property
    def embeddings(self):
        self._init()
        return self._embeddings

    def get_embedding(self, text: str) -> List[float]:
        if not self.embeddings:
            return []
        try:
            return self.embeddings.embed_query(text)
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return []

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self.embeddings:
            return []
        try:
            return self.embeddings.embed_documents(texts)
        except Exception as e:
            print(f"Error getting multiple embeddings: {e}")
            return []


embedding_service = EmbeddingService()
