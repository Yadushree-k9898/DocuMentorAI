from fastapi import APIRouter, HTTPException, Depends
from app.services.qa_service import process_document, answer_question
from app.dependencies import get_current_user, get_db
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.chat import ChatHistory 

router = APIRouter()

@router.post("/{doc_id}/embed")
def embed_document(doc_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    doc = db.query(Document).filter_by(id=doc_id, user_id=current_user.id).first()
    if not doc or not doc.text:
        raise HTTPException(status_code=404, detail="Document not found or no text extracted.")

    try:
        return process_document(str(doc_id), doc.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")




@router.post("/{doc_id}/ask")
def ask_question(
    doc_id: int,
    question: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    print(f"📥 ASK: doc_id={doc_id}, user_id={current_user.id}, question={question}")
    # 🔐 Ensure the user has access to the document
    doc = db.query(Document).filter_by(id=doc_id, user_id=current_user.id).first()
    if not doc or not doc.text:
        raise HTTPException(status_code=404, detail="Document not found.")

    try:
        # 🧠 Try answering from existing embeddings
        raw_answer = answer_question(str(doc_id), question)
        answer = raw_answer["answer"] if isinstance(raw_answer, dict) else str(raw_answer)
    except FileNotFoundError:
        # ⚙️ Embed the document on-the-fly if embeddings are missing
        try:
            process_document(str(doc_id), doc.text)
            raw_answer = answer_question(str(doc_id), question)
            answer = raw_answer["answer"] if isinstance(raw_answer, dict) else str(raw_answer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to auto-embed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to answer: {str(e)}")

    # 💾 Save to chat history
    chat_entry = ChatHistory(
        user_id=current_user.id,
        document_id=doc.id,
        question=question,
        answer=answer,
    )
    db.add(chat_entry)
    db.commit()

    return {"answer": answer}


@router.get("/{doc_id}/history")
def get_chat_history(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 🔐 Secure document access
    doc = db.query(Document).filter_by(id=doc_id, user_id=current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # 📜 Return chat history
    history = db.query(ChatHistory).filter_by(document_id=doc.id, user_id=current_user.id).order_by(ChatHistory.created_at.asc()).all()
    return [{"question": h.question, "answer": h.answer} for h in history]
