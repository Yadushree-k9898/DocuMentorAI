from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token


def register_user(user: UserCreate, db:Session):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, 
                            detail="Username taken")
        
    db_user = User(
        email=user.email,
        username=user.username,
        hash_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def login_user(user:UserLogin, db:Session):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401UNAUTHORIZED, detail="Invalid credentials")
    
    return create_access_token(data={"sub": str(db_user.id)})
        
    
        
        