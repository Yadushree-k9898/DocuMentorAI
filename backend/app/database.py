from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base import Base 

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,     
    pool_recycle=1800,      
    pool_size=10,          
    max_overflow=20,        
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
