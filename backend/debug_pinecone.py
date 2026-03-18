from db.pinecone_client import pinecone_db
from db.firestore_client import firestore_db
from config.settings import get_settings

def check_pinecone_health():
    print("--- Pinecone Health Check ---")
    try:
        pinecone_db._init()
        if not pinecone_db._pc:
            print("ERROR: Pinecone client not initialized.")
            return

        indexes = pinecone_db._pc.list_indexes()
        for idx in indexes:
            print(f"Index Name: {idx.name}")
            print(f"  Dimension: {idx.dimension}")
            print(f"  Metric: {idx.metric}")
            print(f"  Status: {idx.status['state']}")
            
            if idx.dimension != 384:
                print(f"  WARNING: Dimension is {idx.dimension}, but HuggingFace embeddings produce 384. This WILL fail.")
            
            stats = pinecone_db._index.describe_index_stats()
            print(f"  Total Vector Count: {stats['total_vector_count']}")
            print(f"  Namespaces: {stats['namespaces']}")

    except Exception as e:
        print(f"ERROR: Failed to check Pinecone: {e}")

def check_latest_docs():
    print("\n--- Latest Documents in Firestore ---")
    try:
        # We don't have a list_all_documents, so let's try to get bots then their docs
        # This is a bit hard without a specific bot ID, but let's see if we can guess or get all bots
        # For now, let's just skip this and focus on Pinecone.
        pass
    except Exception as e:
        print(f"ERROR: Failed to check Firestore: {e}")

if __name__ == "__main__":
    check_pinecone_health()
