from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from config.settings import get_settings
from db.pinecone_client import pinecone_db
from db.firestore_client import firestore_db
from services.embedding_service import embedding_service


class RAGService:
    def __init__(self):
        self._llm = None

    def _init(self):
        """Lazy initialization."""
        if self._llm is not None:
            return
        try:
            settings = get_settings()
            self._llm = ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model_name="llama-3.3-70b-versatile"
            )
        except Exception as e:
            print(f"Failed to initialize ChatGroq: {e}")
            self._llm = None

    @property
    def llm(self):
        self._init()
        return self._llm

    def get_system_prompt_for_tone(self, bot_data: dict) -> str:
        business_name = bot_data.get('businessName', 'the business')
        base_prompt = f"You are a helpful customer support AI for a business named '{business_name}'. "

        tone = bot_data.get('tone', 'professional')
        if tone == 'professional':
            base_prompt += "Maintain a polite, professional, and clear tone. "
        elif tone == 'friendly':
            base_prompt += "Be warm, welcoming, friendly, and use engaging language. "
        elif tone == 'humorous':
            base_prompt += "Be helpful but add a lighthearted, slightly humorous touch to your responses. "
        elif tone == 'strict':
            base_prompt += "Be concise, strictly factual, and directly to the point. No fluff. "

        base_prompt += (
            "\nINSTRUCTIONS:\n"
            "1. Use the provided context to answer questions about the business, products, or services.\n"
            "2. If the user greets you or asks 'how are you', respond politely in accordance with your tone without needing context.\n"
            "3. If you are asked a specific factual question that is NOT covered by the context, politely explain that you don't have that information and suggest contacting human support.\n"
            "4. NEVER make up facts that are not in the context.\n"
            "5. If context is empty, still be polite but state your limitations regarding specific business queries.\n\n"
            "CONTEXT FROM KNOWLEDGE BASE:\n{context}"
        )
        return base_prompt

    def convert_history(self, history: list) -> list:
        langchain_history = []
        for msg in history:
            role = msg.get('role')
            content = msg.get('content', '')
            if not content: continue
            
            if role == 'user':
                langchain_history.append(HumanMessage(content=content))
            elif role == 'assistant':
                langchain_history.append(AIMessage(content=content))
        return langchain_history

    def generate_answer(self, bot_id: str, query: str, chat_history: list) -> str:
        if not self.llm:
            return "LLM not initialized properly."

        # 1. Fetch Bot Info for Tone
        bot_data = firestore_db.get_bot(bot_id)
        if not bot_data:
            return "Error: Bot not found."

        bot_namespace = bot_data.get('namespace', bot_id)

        # 2. Embed Query
        query_vector = embedding_service.get_embedding(query)
        if not query_vector:
            return "Error: Could not generate embedding for query."

        # 3. Retrieve Context from Pinecone
        matches = pinecone_db.query_vectors(
            query_vector=query_vector,
            namespace=bot_namespace,
            top_k=5
        )
        
        print(f"DEBUG: RAG Retrieval for query '{query}' in namespace '{bot_namespace}'")
        print(f"DEBUG: Found {len(matches)} matches.")

        context_texts = []
        for i, match in enumerate(matches):
            score = match.get('score', 0)
            metadata = match.get('metadata', {})
            text = metadata.get('text', '')
            print(f"DEBUG: Match {i+1} - Score: {score:.4f} - Source: {metadata.get('source')}")
            if text:
                context_texts.append(text)

        context_str = "\n\n".join(context_texts) if context_texts else "The knowledge base is currently empty or no relevant info was found."

        # 4. Construct Prompt
        system_prompt = self.get_system_prompt_for_tone(bot_data).replace("{context}", context_str)

        # 5. Build Messages
        messages = [SystemMessage(content=system_prompt)]
        messages.extend(self.convert_history(chat_history))
        messages.append(HumanMessage(content=query))

        # 6. Call LLM
        try:
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            print(f"Error calling LLM: {e}")
            return "An error occurred while generating the response."


rag_service = RAGService()
