from app.schemas.document import DocumentChunk

def chunk_text(text: str, doc_id: str, page_number: int, chunk_size: int = 500, overlap: int = 50) -> list[DocumentChunk]:
    words = text.split()
    chunks = []

    i = 0
    chunk_id = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        content = " ".join(chunk_words)

        chunk = DocumentChunk(
            doc_id=doc_id,
            page_number=page_number,
            chunk_id=chunk_id,
            content=content,
            metadata={
                "start_word": i,
                "end_word": i + len(chunk_words)
            }
        )

        chunks.append(chunk)
        i += chunk_size - overlap
        chunk_id += 1

    return chunks
