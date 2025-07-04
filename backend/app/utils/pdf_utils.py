import fitz  # PyMuPDF
from app.utils.chunking import chunk_text
from app.schemas.document import DocumentChunk
import uuid

def extract_chunks_from_pdf(filepath: str, doc_id: str = None) -> list[DocumentChunk]:
    chunks = []
    doc_id = doc_id or str(uuid.uuid4())

    with fitz.open(filepath) as doc:
        for i, page in enumerate(doc, start=1):
            raw_text = page.get_text()
            if not raw_text.strip():
                continue  # skip blank pages

            page_chunks = chunk_text(raw_text, page_number=i, doc_id=doc_id)
            chunks.extend(page_chunks)

    return chunks
