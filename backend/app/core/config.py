from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(..., alias="DATABASE_URL")
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    secret_key: str = Field(..., alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    algorithm: str = Field("HS256", alias="ALGORITHM")

    model_config = SettingsConfigDict(
        env_file=".env",
        populate_by_name=True,
        extra="allow"
    )

settings = Settings()
