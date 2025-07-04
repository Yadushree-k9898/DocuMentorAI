from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    text = Column(JSON, nullable=False)  # <- make sure it's JSON
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime)

    user = relationship("User", back_populates="documents")
