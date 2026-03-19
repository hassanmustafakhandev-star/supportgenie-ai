# SupportGenie AI - Custom RAG-based SaaS

SupportGenie AI is a powerful, ready-to-deploy SaaS platform that allows businesses to create custom AI support agents trained on their own data (Websites, PDFs, FAQs). Built with a modern tech stack, it features a slick futuristic dashboard, real-time analytics, and an embeddable chat widget.

![Dashboard Preview](https://supportgenie-ai-phh4.vercel.app/)

## 🚀 Features

-   **Multi-Source Training**: Train your AI agents on any Website URL, PDF document, or raw FAQ text.
-   **Advanced RAG Engine**: Utilizes LangChain, HuggingFace embeddings (384-dim), and Groq (Llama 3.3 70B) for lightning-fast, accurate responses.
-   **Futuristic Dashboard**: Glassmorphic UI with real-time analytics, bot management, and chat logs.
-   **Embeddable Widget**: A sleek, customizable chat widget that can be integrated into any website with a single line of code.
-   **Serverless Vector Search**: Powered by Pinecone for low-latency retrieval.
-   **Secure Authentication**: Fully integrated with Firebase Auth.

## 🛠 Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS, Lucide React, Framer Motion.
-   **Backend**: FastAPI (Python), BackgroundTasks for async processing.
-   **AI/ML**: LangChain, HuggingFace (all-MiniLM-L6-v2), Groq (llama-3.3-70b-versatile).
-   **Databases**: Firestore (Metadata & Logs), Pinecone (Vector Store).
-   **Deployment**: Vercel (Frontend), Railway/Railway (Backend - Recommended).

## 🏁 Getting Started

### Prerequisites

-   Python 3.10+
-   Node.js 18+
-   Firebase Account
-   Pinecone API Key
-   Groq API Key

### Backend Setup

1.  Navigate to `/backend`.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Configure `.env` with your API keys (see `.env.example`).
4.  Run the server: `uvicorn main:app --reload`.

### Frontend Setup

1.  Navigate to `/frontend`.
2.  Install dependencies: `npm install`.
3.  Configure `.env.local` with Firebase and API URL.
4.  Run the dev server: `npm run dev`.

## 📈 Integration Flow

1.  **Bot Creation**: Create a bot in the dashboard and provide training data.
2.  **Training**: The backend scrapes/extracts text, generates embeddings, and stores them in Pinecone.
3.  **Deployment**: Copy the generated `<script>` tag from the bot's "Test & Embed" page.
4.  **Interaction**: The widget handles user queries via the RAG pipeline.

## 📝 License

This project is licensed under the MIT License.
