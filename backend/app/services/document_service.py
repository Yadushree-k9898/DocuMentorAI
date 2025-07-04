import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.gemini_api_key)

def summarize_text_with_gemini(text: str) -> str:
    if not text:
        return "No content to summarize."

    try:
        # Use a valid, supported model
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(f"Summarize this document:\n\n{text[:8000]}")
        return response.text.strip()
    except Exception as e:
        return f"Error during summarization: {str(e)}"
