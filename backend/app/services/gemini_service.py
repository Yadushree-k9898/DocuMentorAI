import httpx
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEFAULT_MODEL = "gemini-1.5-flash"
GEMINI_ENDPOINT_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"

# Core function with retry and error handling
async def call_gemini_api(prompt: str, model: str = DEFAULT_MODEL, max_retries: int = 3, backoff: int = 2) -> str:
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    url = GEMINI_ENDPOINT_TEMPLATE.format(model)
    attempt = 0

    while attempt < max_retries:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(url, headers=headers, json=payload)

            if response.status_code == 200:
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]

            elif response.status_code == 429:
                # Rate limited
                wait_time = backoff ** attempt
                print(f"[Gemini] Rate limit hit. Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
                attempt += 1

            elif 400 <= response.status_code < 500:
                return f"Request error from Gemini (code {response.status_code}): {response.text}"

            elif 500 <= response.status_code < 600:
                return f"Server error from Gemini (code {response.status_code}): {response.text}"

        except httpx.TimeoutException:
            attempt += 1
            print(f"[Gemini] Timeout. Retrying in {backoff ** attempt}s...")
            await asyncio.sleep(backoff ** attempt)

        except Exception as e:
            return f"Unexpected Gemini error: {str(e)}"

    return "Gemini service unavailable after retries."
