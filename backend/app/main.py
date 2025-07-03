from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import auth, documents, qa
from app.database import Base, engine
from app.models import user  

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DocuMentorAI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In prod, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to DocuMentorAI API!"}


app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(qa.router, prefix="/api/v1/qa", tags=["Q&A"])
