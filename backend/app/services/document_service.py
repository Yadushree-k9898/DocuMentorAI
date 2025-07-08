from transformers import pipeline

# Initialize summarizer once at the top level
summarizer = pipeline("summarization", model="t5-small")

def summarize_text_with_t5(text_chunks: list[str], max_chunks: int = 5) -> str:
    """
    Summarize a list of text chunks using t5-small transformers model.
    Limits number of chunks and input size for speed.
    """
    if not text_chunks:
        return "No content to summarize."

    all_summaries = []

    for idx, chunk in enumerate(text_chunks[:max_chunks]):
        chunk = chunk.strip()
        if not chunk:
            continue

        try:
            result = summarizer(chunk[:1000], max_length=100, min_length=30, do_sample=False)
            summary = result[0]['summary_text']
            all_summaries.append(summary)
        except Exception as e:
            all_summaries.append(f"[Chunk {idx+1} Error] {str(e)}")

    return "\n\n".join(all_summaries)
