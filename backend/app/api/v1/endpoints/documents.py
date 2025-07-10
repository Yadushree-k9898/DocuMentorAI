from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.document import Document
from app.utils.pdf_utils import extract_chunks_from_pdf
from app.services.document_service import summarize_text_with_gemini

import shutil, os, uuid, json
from datetime import datetime

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ------------------------------------
# 📤 Upload PDF Route
# ------------------------------------
@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")

    # Use unique filename to avoid overwriting
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract and convert chunks to dict
    chunks = extract_chunks_from_pdf(file_path)
    text = [chunk.dict() for chunk in chunks]

    # Create and save document
    document = Document(
        filename=unique_filename,
        text=text,
        user_id=current_user.id,
        created_at=datetime.utcnow()  # ensure your model supports this default
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "message": "PDF uploaded successfully",
        "document_id": document.id,
        "filename": document.filename,
        "created_at": document.created_at
    }

# ------------------------------------
# 📄 Summarize Route
# ------------------------------------
@router.post("/{doc_id}/summarize")
def summarize_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Get the document for the current user
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found or access denied.")

    if not document.text:
        raise HTTPException(status_code=400, detail="Document has no extracted text.")

    # Safely parse JSON or native list
    try:
        parsed = json.loads(document.text) if isinstance(document.text, str) else document.text
        if not isinstance(parsed, list):
            raise ValueError("Parsed document text is not a list of chunks.")
        text_chunks = [chunk.get("content", "") for chunk in parsed if chunk.get("content")]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse document text chunks: {str(e)}")

    # Generate summary using T5
    summary = summarize_text_with_gemini(text_chunks)

    # Save summary to database
    document.summary = summary
    db.commit()

    return {
        "document_id": document.id,
        "summary": summary
    }


# ------------------------------------
# 📋 Get All Documents for Current User
# ------------------------------------
@router.get("/documents")
def get_user_documents(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    documents = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "created_at": doc.created_at,
            "summary_preview": doc.summary[:100] + "..." if doc.summary else "No summary yet."
        }
        for doc in documents
    ]


@router.get("/documents/{doc_id}")
def get_single_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    print(f"🔍 Fetching document with ID: {doc_id} for user ID: {current_user.id}")

    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        print("❌ Document not found or does not belong to the user.")
        raise HTTPException(status_code=404, detail="Document not found")

    print("✅ Document found and returned.")
    return {
        "id": document.id,
        "filename": document.filename,
        "created_at": document.created_at,
        "text": document.text,
        "summary": document.summary or "No summary yet"
    }
