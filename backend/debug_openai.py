import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

def test_ai_providers():
    groq_key = os.getenv("GROQ_API_KEY", "").strip('"').strip("'")
    print(f"DEBUG: Using Groq Key (start): {groq_key[:10]}...")
    
    try:
        print("DEBUG: Attempting to initialize ChatGroq (Llama 3)...")
        llm = ChatGroq(
            api_key=groq_key,
            model_name="llama-3.3-70b-versatile"
        )
        print("SUCCESS: ChatGroq initialized.")
        
        print("DEBUG: Attempting to initialize HuggingFaceEmbeddings (MiniLM)...")
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        print("SUCCESS: HuggingFaceEmbeddings initialized.")
        
        print("\n--- ALL SYSTEMS FUNCTIONAL ---")
        
    except Exception as e:
        print(f"ERROR: AI Provider Initialization failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ai_providers()
