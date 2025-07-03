from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user
from app.dependencies import get_db

router = APIRouter(tags=["auth"])  # ✅ Removed internal prefix

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(user, db)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return {"access_token": login_user(user, db), "token_type": "bearer"}
