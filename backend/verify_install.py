"""Quick verification script - run: py verify_install.py"""

imports = [
    ("fastapi", "FastAPI"),
    ("uvicorn", "Uvicorn"),
    ("pydantic", "Pydantic"),
    ("pydantic_settings", "Pydantic Settings"),
    ("langchain", "LangChain"),
    ("langchain_openai", "LangChain OpenAI"),
    ("langchain_community", "LangChain Community"),
    ("openai", "OpenAI"),
    ("pinecone", "Pinecone"),
    ("firebase_admin", "Firebase Admin"),
    ("celery", "Celery"),
    ("redis", "Redis"),
    ("PyPDF2", "PyPDF2"),
    ("bs4", "BeautifulSoup4"),
    ("requests", "Requests"),
    ("lxml", "lxml"),
    ("dotenv", "python-dotenv"),
]

print("--- Package Verification ---")
ok = 0
fail = 0
for mod, name in imports:
    try:
        __import__(mod)
        print(f"  OK  {name}")
        ok += 1
    except ImportError as e:
        print(f"  FAIL  {name} -- {e}")
        fail += 1

print(f"\n{ok} passed, {fail} failed")
if fail == 0:
    print("All packages installed successfully!")
else:
    print("Run: pip install -r requirements.txt")
