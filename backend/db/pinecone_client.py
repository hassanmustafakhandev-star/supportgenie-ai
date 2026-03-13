from pinecone import Pinecone, ServerlessSpec
from config.settings import get_settings
from typing import List, Dict, Any


class PineconeClient:
    def __init__(self):
        self._pc = None
        self._index = None
        self.index_name = "supportgenie-index"

    def _init(self):
        """Lazy initialization to avoid crashing at import time if keys are missing."""
        if self._pc is not None:
            return
        try:
            settings = get_settings()
            self._pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            self._ensure_index_exists()
            self._index = self._pc.Index(self.index_name)
        except Exception as e:
            print(f"Pinecone initialization failed: {e}")
            self._pc = None
            self._index = None

    def _ensure_index_exists(self):
        if self._pc:
            active_indexes = [idx.name for idx in self._pc.list_indexes()]
            if self.index_name not in active_indexes:
                # NOTE: HuggingFace all-MiniLM-L6-v2 uses 384 dimensions.
                # If you previously created an index with 1536 dimensions (OpenAI), 
                # you MUST delete and recreate the index in the Pinecone console.
                self._pc.create_index(
                    name=self.index_name,
                    dimension=384,
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )

    @property
    def index(self):
        self._init()
        return self._index

    def upsert_vectors(self, vectors: List[Dict[str, Any]], namespace: str):
        """
        vectors: [{'id': 'vec1', 'values': [0.1, 0.2, ...], 'metadata': {'text': '...'}}]
        """
        if not self.index:
            return False
        try:
            print(f"DEBUG: Upserting {len(vectors)} vectors to Pinecone in namespace '{namespace}'...")
            self.index.upsert(vectors=vectors, namespace=namespace)
            return True
        except Exception as e:
            print(f"CRITICAL ERROR upserting to Pinecone: {e}")
            return False

    def query_vectors(self, query_vector: List[float], namespace: str, top_k: int = 5) -> List[Dict[str, Any]]:
        if not self.index:
            return []
        try:
            response = self.index.query(
                vector=query_vector,
                namespace=namespace,
                top_k=top_k,
                include_metadata=True
            )
            # Pinecone v3 returns an object with .matches attribute, not a dict
            matches = response.matches if hasattr(response, 'matches') else response.get('matches', [])
            result = []
            for match in matches:
                item = {
                    'id': match.id if hasattr(match, 'id') else match.get('id'),
                    'score': match.score if hasattr(match, 'score') else match.get('score'),
                    'metadata': match.metadata if hasattr(match, 'metadata') else match.get('metadata', {})
                }
                result.append(item)
            return result
        except Exception as e:
            print(f"Error querying Pinecone: {e}")
            return []

    def delete_namespace(self, namespace: str):
        if not self.index:
            return False
        try:
            self.index.delete(delete_all=True, namespace=namespace)
            return True
        except Exception as e:
            print(f"Error deleting namespace in Pinecone: {e}")
            return False

    def delete_vectors_by_doc_id(self, namespace: str, doc_id: str):
        """Delete all vectors matching a specific doc_id in the given namespace."""
        if not self.index:
            return False
        try:
            self.index.delete(filter={"doc_id": {"$eq": doc_id}}, namespace=namespace)
            return True
        except Exception as e:
            print(f"Error deleting vectors by doc_id: {e}")
            return False


pinecone_db = PineconeClient()
