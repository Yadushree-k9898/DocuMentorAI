from google.generativeai import GenerativeModel
import google.generativeai as genai
from app.core.config import settings

# Configure API key
genai.configure(api_key=settings.gemini_api_key)

# Switch to flash model
model = GenerativeModel("models/gemini-1.5-flash")




# app/services/document_service.py
from app.services.gemini_service import call_gemini_api
import asyncio

def summarize_text_with_gemini(text_chunks: list[str], max_chunks: int = 5) -> str:
    summaries = []

    for idx, chunk in enumerate(text_chunks[:max_chunks]):
        chunk = chunk.strip()
        if not chunk:
            continue

        prompt = f"Summarize the following text:\n\n{chunk}"
        try:
            summary = asyncio.run(call_gemini_api(prompt))  # calls async function from sync context
            summaries.append(summary)
        except Exception as e:
            summaries.append(f"[Chunk {idx+1} Error] {str(e)}")

    return "\n\n".join(summaries)
