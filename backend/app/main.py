from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import auth, documents, qa
from app.db.base import Base
from app.database import engine

# Create DB tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="DocuMentorAI")

# Enable CORS (adjust allow_origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/")
def root():
    return {"message": "Welcome to DocuMentorAI API!"}

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(qa.router, prefix="/api/v1/qa", tags=["Q&A"])
