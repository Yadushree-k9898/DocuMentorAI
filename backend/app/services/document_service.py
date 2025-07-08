# app/services/document_service.py

import ollama

def summarize_text_with_ollama(text_chunks: list[str], model: str = 'gemma:2b', max_chunks: int = 5) -> str:
    """
    Summarize a list of text chunks quickly using Ollama with the specified model.
    Limits number of chunks and input size for speed.
    """
    if not text_chunks:
        return "No content to summarize."

    all_summaries = []

    for idx, chunk in enumerate(text_chunks[:max_chunks]):  # Limit number of chunks
        chunk = chunk.strip()
        if not chunk:
            continue

        try:
            prompt = f"Summarize the following text:\n\n{chunk[:1200]}"  # further reduced size
            response = ollama.chat(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            summary = response['message']['content'].strip()
            all_summaries.append(summary)
        except Exception as e:
            all_summaries.append(f"[Chunk {idx+1} Error] {str(e)}")

    return "\n\n".join(all_summaries)
