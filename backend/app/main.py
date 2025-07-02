from fastapi import FastAPI

from app.api.v1.endpoints import auth, documents, qa


app = FastAPI(title="DocuMentorAI")


app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(documents.router, prefix="api/v1/documents", tags=["Documents"])
app.include_router(qa.router, prefix="/api/v1/qa", tags=["Q&A"])