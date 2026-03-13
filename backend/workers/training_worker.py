from workers.celery_app import celery_app
from services.embedding_service import embedding_service
from services.document_processor import chunk_text
from db.pinecone_client import pinecone_db
from db.firestore_client import firestore_db

def process_document_logic(doc_id: str, bot_id: str, text: str, source_name: str, namespace: str):
    """
    Core logic to chunk text, generate embeddings, and upload to Pinecone.
    Can be run synchronously (via FastAPI BackgroundTasks) or via Celery.
    """
    try:
        # Update status to processing
        firestore_db.update_document_status(doc_id, "processing")

        print(f"Task started for document {doc_id}. Text length: {len(text)}")

        # 1. Chunk Text
        chunks = chunk_text(text, source=source_name)
        if not chunks:
            print(f"CRITICAL: No chunks generated for document {doc_id}!")
            raise Exception("No chunks generated from the document text.")
            
        print(f"Generated {len(chunks)} chunks for {source_name}.")

        # 2. Process in batches to avoid overwhelming OpenAI API limits
        batch_size = 100
        total_vectors = []
        
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            texts = [c['text'] for c in batch]
            
            # Generate embeddings for the batch
            embeddings = embedding_service.get_embeddings(texts)
            if not embeddings or len(embeddings) != len(texts):
                raise Exception("Failed to generate embeddings for batch.")
            
            # Prepare vectors for Pinecone
            # Format: {'id': str, 'values': List[float], 'metadata': dict}
            for j, chunk in enumerate(batch):
                total_vectors.append({
                    'id': chunk['id'],
                    'values': embeddings[j],
                    'metadata': {
                        'text': chunk['text'],
                        'source': chunk['source'],
                        'doc_id': doc_id
                    }
                })
        
        print(f"Total vectors prepared: {len(total_vectors)}")

        # 3. Upload to Vector Store (Pinecone)
        print(f"Upserting {len(total_vectors)} vectors to Pinecone under namespace '{namespace}'...")
        # Upsert in smaller chunks to Pinecone as well if needed (e.g., 200 vectors at a time)
        pc_batch_size = 200
        for i in range(0, len(total_vectors), pc_batch_size):
            pc_batch = total_vectors[i:i+pc_batch_size]
            success = pinecone_db.upsert_vectors(vectors=pc_batch, namespace=namespace)
            if not success:
                raise Exception(f"Failed to upsert vectors batch to Pinecone.")

        # 4. Mark Complete
        firestore_db.update_document_status(doc_id, "completed")
        print(f"Document {doc_id} successfully processed and added to Pinecone.")
        
        return {"status": "success", "doc_id": doc_id, "chunks_processed": len(chunks)}

    except Exception as exc:
        firestore_db.update_document_status(doc_id, "failed")
        print(f"Failed to process document {doc_id}. Error: {exc}")
        raise exc


@celery_app.task(bind=True, max_retries=3)
def process_document_task(self, doc_id: str, bot_id: str, text: str, source_name: str, namespace: str):
    """
    Celery background worker task wrapper.
    """
    try:
        return process_document_logic(doc_id, bot_id, text, source_name, namespace)
    except Exception as exc:
        try:
            self.retry(exc=exc, countdown=60) # Retry after 1 minute
        except self.MaxRetriesExceededError:
            print(f"Max retries exceeded for document {doc_id}")
            return {"status": "failed", "doc_id": doc_id, "error": str(exc)}

