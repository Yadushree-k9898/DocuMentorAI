# app/services/document_service.py

import ollama

def summarize_text_with_ollama(text: str) -> str:
    if not text:
        return "No content to summarize."

    try:
        prompt = f"Summarize the following document:\n\n{text[:4000]}"
        response = ollama.chat(
            model='mistral',
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response['message']['content'].strip()
    except Exception as e:
        return f"Error during summarization: {str(e)}"
