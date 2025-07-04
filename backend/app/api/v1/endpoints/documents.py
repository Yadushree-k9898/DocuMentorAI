from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.models.document import Document
from app.utils.pdf_utils import extract_chunks_from_pdf
from app.services.document_service import summarize_text_with_gemini  

import shutil, os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")

    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔁 Fix: Convert chunks to dicts before saving
    chunks = extract_chunks_from_pdf(file_path)
    text = [chunk.dict() for chunk in chunks]

    document = Document(
        filename=file.filename,
        text=text,
        user_id=current_user.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    return {"message": "PDF uploaded successfully", "document_id": document.id}


@router.post("/{doc_id}/summarize")
def summarize_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    document = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found or access denied.")

    if not document.text:
        raise HTTPException(status_code=400, detail="Document has no extracted text.")

    summary = summarize_text_with_gemini(document.text)

    return {"summary": summary}
