import os
from dotenv import load_dotenv
load_dotenv()

from services.embedding_service import embedding_service
from db.pinecone_client import pinecone_db

def test_query(query: str, namespace: str):
    print(f"--- Testing Query: '{query}' in Namespace: '{namespace}' ---")
    try:
        # 1. Embed query
        print("Embedding query...")
        query_vector = embedding_service.get_embedding(query)
        print(f"Generated vector of length {len(query_vector)}")
        
        # 2. Query Pinecone
        print("Querying Pinecone...")
        results = pinecone_db.query_vectors(query_vector, namespace=namespace, top_k=5)
        
        print(f"Found {len(results)} matches.")
        for i, res in enumerate(results):
            print(f"Match {i+1} (Score: {res['score']}):")
            print(f"Text Snippet: {res['metadata'].get('text', '')[:200]}...")
            print("-" * 20)

    except Exception as e:
        print(f"QUERY TEST FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Test with the simulation namespace from the previous run
    # Note: The user's previous run used 'sim_ns_test_bot_123'
    test_query("creation of pakistan", "sim_ns_test_bot_123")
