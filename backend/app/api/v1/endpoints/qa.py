from fastapi import APIRouter, HTTPException, Depends
from app.services.qa_service import process_document, answer_question
from app.dependencies import get_current_user, get_db
from sqlalchemy.orm import Session
from app.models.document import Document

router = APIRouter()

@router.post("/{doc_id}/embed")
def embed_document(doc_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    doc = db.query(Document).filter_by(id=doc_id, user_id=current_user.id).first()
    if not doc or not doc.text:
        raise HTTPException(status_code=404, detail="Document not found or no text extracted.")
    
    return process_document(str(doc_id), doc.text)

@router.post("/{doc_id}/ask")
def ask_question(doc_id: int, question: str, current_user=Depends(get_current_user)):
    try:
        return answer_question(str(doc_id), question)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Embeddings not found. Please embed the document first.")
