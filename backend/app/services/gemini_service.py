# app/services/gemini_service.py
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" 

async def call_gemini_api(prompt: str) -> str:
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(GEMINI_ENDPOINT, headers=headers, json=payload)
        result = response.json()

    try:
        return result['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError):
        return "Gemini response error"
