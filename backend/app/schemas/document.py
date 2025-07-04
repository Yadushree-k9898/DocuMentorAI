from pydantic import BaseModel, Field
from typing import Dict, Optional


class DocumentChunk(BaseModel):
    """
    Represents a single chunk of a parsed PDF document.
    """
    doc_id: str = Field(..., description="UUID of the parent document")
    page_number: int = Field(..., ge=1, description="Page number of the chunk in the PDF")
    chunk_id: int = Field(..., ge=0, description="Chunk index on the given page")
    content: str = Field(..., min_length=1, description="Text content of the chunk")
    metadata: Dict[str, int] = Field(default_factory=dict, description="Metadata such as start_word and end_word indices")

    class Config:
        schema_extra = {
            "example": {
                "doc_id": "b7d6c8e8-4a4d-47f5-b1b2-5b1b792f4a00",
                "page_number": 2,
                "chunk_id": 1,
                "content": "This is a sample chunk extracted from page 2 of the document.",
                "metadata": {
                    "start_word": 0,
                    "end_word": 42
                }
            }
        }
        extra = "forbid"
        orm_mode = True
