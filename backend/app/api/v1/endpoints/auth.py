from fastapi import FastAPI

router = APIRouter()

@router.post("/login")
def login():
    return{"message": "Login endpoint"}

@router.post("/register")
def register():
    return {"message": "Register endpoint"}

