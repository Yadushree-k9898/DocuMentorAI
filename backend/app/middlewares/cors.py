from fastapi.middleware.cors import CORSMiddleware

def get_cors_middleware():
    return {
        "middleware_class": CORSMiddleware,
        "options": {
            "allow_origins": ["*"],  # Replace with specific origins in production
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"],
        }
    }
