import firebase_admin
from firebase_admin import firestore
from google.cloud.firestore_v1 import Increment
from typing import List, Optional, Dict, Any
from datetime import datetime


class FirestoreClient:
    def __init__(self):
        self._db = None

    @property
    def db(self):
        """Lazy-initialize Firestore client so Firebase Admin has time to initialize in main.py."""
        if self._db is None:
            try:
                self._db = firestore.client()
            except Exception as e:
                print(f"Firestore not initialized yet, error: {e}")
                return None
        return self._db

    # --- Users ---
    def create_or_update_user(self, uid: str, user_data: dict):
        if not self.db:
            return None
        doc_ref = self.db.collection('users').document(uid)
        user_data['id'] = uid
        if 'createdAt' not in user_data:
            user_data['createdAt'] = datetime.utcnow().isoformat()
        doc_ref.set(user_data, merge=True)
        return user_data

    def get_user(self, user_id: str) -> Optional[dict]:
        if not self.db:
            return None
        doc = self.db.collection('users').document(user_id).get()
        return doc.to_dict() if doc.exists else None

    # --- Bots ---
    def create_bot(self, bot_id: str, bot_data: dict):
        if not self.db:
            return None
        self.db.collection('bots').document(bot_id).set(bot_data)
        return bot_data

    def get_user_bots(self, user_id: str) -> List[dict]:
        if not self.db:
            return []
        docs = self.db.collection('bots').where('userId', '==', user_id).stream()
        return [doc.to_dict() for doc in docs]

    def get_bot(self, bot_id: str) -> Optional[dict]:
        if not self.db:
            return None
        doc = self.db.collection('bots').document(bot_id).get()
        return doc.to_dict() if doc.exists else None

    def delete_bot(self, bot_id: str):
        if not self.db:
            return False
        self.db.collection('bots').document(bot_id).delete()
        return True

    # --- Documents ---
    def add_document(self, doc_data: dict):
        if not self.db:
            return None
        doc_id = doc_data['id']
        self.db.collection('documents').document(doc_id).set(doc_data)
        return doc_data

    def get_bot_documents(self, bot_id: str) -> List[dict]:
        if not self.db:
            return []
        docs = self.db.collection('documents').where('botId', '==', bot_id).stream()
        return [doc.to_dict() for doc in docs]

    def update_document_status(self, doc_id: str, status: str):
        if not self.db:
            return False
        self.db.collection('documents').document(doc_id).update({'status': status})
        return True

    def delete_document(self, doc_id: str):
        if not self.db:
            return False
        self.db.collection('documents').document(doc_id).delete()
        return True

    # --- Chats & Messages ---
    def create_chat(self, chat_id: str, bot_id: str):
        if not self.db:
            return None
        data = {
            'id': chat_id,
            'botId': bot_id,
            'createdAt': datetime.utcnow().isoformat()
        }
        self.db.collection('chats').document(chat_id).set(data)
        return data

    def get_bot_chats(self, bot_id: str) -> List[dict]:
        if not self.db:
            return []
        docs = self.db.collection('chats').where('botId', '==', bot_id).stream()
        return [doc.to_dict() for doc in docs]

    def add_message(self, chat_id: str, role: str, content: str):
        if not self.db:
            return None
        msg_ref = self.db.collection('chats').document(chat_id).collection('messages').document()
        msg_data = {
            'id': msg_ref.id,
            'chatId': chat_id,
            'role': role,
            'content': content,
            'timestamp': datetime.utcnow().isoformat()
        }
        msg_ref.set(msg_data)
        return msg_data

    def get_chat_history(self, chat_id: str) -> List[dict]:
        if not self.db:
            return []
        docs = self.db.collection('chats').document(chat_id).collection('messages').order_by('timestamp').stream()
        return [doc.to_dict() for doc in docs]

    # --- Usage ---
    def increment_usage(self, user_id: str, token_count: int, month: str):
        if not self.db:
            return False
        doc_ref = self.db.collection('usage').document(f"{user_id}_{month}")
        doc = doc_ref.get()
        if doc.exists:
            doc_ref.update({
                'messageCount': Increment(1),
                'tokenUsage': Increment(token_count)
            })
        else:
            doc_ref.set({
                'userId': user_id,
                'month': month,
                'messageCount': 1,
                'tokenUsage': token_count
            })
        return True

    def get_usage(self, user_id: str, month: str) -> Optional[dict]:
        if not self.db:
            return None
        doc = self.db.collection('usage').document(f"{user_id}_{month}").get()
        return doc.to_dict() if doc.exists else None


firestore_db = FirestoreClient()
