from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, computed_field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[4]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(PROJECT_ROOT / ".env", API_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: Literal["development", "test", "staging", "production"] = "development"
    supabase_url: str | None = Field(default=None, alias="SUPABASE_URL")
    supabase_anon_key: str | None = Field(default=None, alias="SUPABASE_ANON_KEY")
    supabase_service_role_key: str | None = Field(default=None, alias="SUPABASE_SERVICE_ROLE_KEY")
    guest_session_ttl_minutes: int = Field(default=120, alias="GUEST_SESSION_TTL_MINUTES", ge=5, le=1440)
    ai_provider: Literal["mock", "openai", "local"] = Field(default="mock", alias="AI_PROVIDER")
    ai_model: str = Field(default="gpt-5.5", alias="AI_MODEL")
    local_llm_url: str = Field(default="http://127.0.0.1:11434", alias="LOCAL_LLM_URL")
    local_llm_model: str = Field(default="llama3.1:8b", alias="LOCAL_LLM_MODEL")
    transcription_provider: Literal["mock", "openai", "local"] = Field(default="mock", alias="TRANSCRIPTION_PROVIDER")
    transcription_model: str = Field(default="gpt-4o-transcribe", alias="TRANSCRIPTION_MODEL")
    local_transcription_model: str = Field(default="base", alias="LOCAL_TRANSCRIPTION_MODEL")
    transcription_max_upload_mb: int = Field(default=12, alias="TRANSCRIPTION_MAX_UPLOAD_MB", ge=1, le=25)
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    cors_origins: str = Field(default="http://localhost:3000,http://127.0.0.1:3000", alias="CORS_ORIGINS")

    @computed_field
    @property
    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_service_role_key)

    @computed_field
    @property
    def supabase_auth_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_anon_key)

    @field_validator("transcription_provider", mode="before")
    @classmethod
    def normalize_transcription_provider(cls, value: str | None) -> str:
        return (value or "mock").strip().lower()

    @field_validator("ai_provider", mode="before")
    @classmethod
    def normalize_ai_provider(cls, value: str | None) -> str:
        return (value or "mock").strip().lower()

    @field_validator("openai_api_key", mode="before")
    @classmethod
    def normalize_openai_api_key(cls, value: str | None) -> str | None:
        clean = value.strip() if isinstance(value, str) else value
        return clean or None

    @computed_field
    @property
    def transcription_real_configured(self) -> bool:
        return bool(self.transcription_provider == "openai" and self.openai_api_key)

    @computed_field
    @property
    def ai_real_configured(self) -> bool:
        return bool(self.ai_provider == "openai" and self.openai_api_key)

    @computed_field
    @property
    def parsed_cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
