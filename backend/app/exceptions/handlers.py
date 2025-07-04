from fastapi import Request
from fastapi.responses import JSONResponse
from google.api_core.exceptions import ResourceExhausted
import logging

logger = logging.getLogger(__name__)

def handle_resource_exhausted(request: Request, exc: ResourceExhausted):
    logger.warning(f"Gemini quota exceeded: {exc}")
    retry_time = "1:30 PM IST"  # 🕒 Can be dynamic later

    return JSONResponse(
        status_code=429,
        content={
            "detail": "Gemini API quota exceeded (Free Tier).",
            "message": f"Try again after {retry_time} or consider upgrading your plan.",
            "hint": "You've hit the daily/minute quota for Gemini. Please retry later."
        },
    )
