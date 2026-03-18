import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

def debug_firestore():
    project_id = os.getenv("FIREBASE_PROJECT_ID", "").strip('"').strip("'")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL", "").strip('"').strip("'")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY", "").strip('"').strip("'").replace('\\n', '\n')
    
    print(f"DEBUG: Attempting to connect to project: {project_id}")
    print(f"DEBUG: Using client email: {client_email}")
    
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key,
                "client_email": client_email,
                "token_uri": "https://oauth2.googleapis.com/token",
            })
            firebase_admin.initialize_app(cred)
            print("SUCCESS: Firebase Admin Initialized")
            
        db = firestore.client()
        print("SUCCESS: Firestore client created")
        
        # Try a simple write
        print("DEBUG: Attempting to write a test document...")
        doc_ref = db.collection('debug_test').document('test_doc')
        doc_ref.set({'status': 'connection_successful', 'timestamp': firestore.SERVER_TIMESTAMP})
        print("SUCCESS: Document written successfully!")
        
        # Try a read
        doc = doc_ref.get()
        print(f"SUCCESS: Read back test doc: {doc.to_dict()}")
        
    except Exception as e:
        print(f"FAILED: Connection or operation failed: {e}")
        if "403" in str(e) or "PermissionDenied" in str(e):
            print("\n!!! ACTION REQUIRED !!!")
            print("The Cloud Firestore API is indeed disabled or not used in this project.")
            print(f"Please visit: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project={project_id}")
            print("And click the ENABLE button.")

if __name__ == "__main__":
    debug_firestore()
