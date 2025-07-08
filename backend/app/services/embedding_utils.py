"""
This version removes all FAISS/vector embedding logic.
Used when relying fully on Gemini for semantic understanding and QA.
"""

def split_text_into_chunks(text: str, max_chunk_length: int = 2000) -> list[str]:
    """
    Splits long text into basic chunks that Gemini can handle.
    Not for embedding — just for preparing input context.
    """
    if not text:
        return []

    words = text.split()
    chunks = []
    chunk = []

    for word in words:
        chunk.append(word)
        if len(" ".join(chunk)) > max_chunk_length:
            chunks.append(" ".join(chunk))
            chunk = []

    if chunk:
        chunks.append(" ".join(chunk))

    return chunks
