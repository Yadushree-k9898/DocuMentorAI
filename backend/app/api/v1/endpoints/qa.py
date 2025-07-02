from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_documents():
    return {"message": "Documents endpoint working"}
