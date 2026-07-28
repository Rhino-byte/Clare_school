from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./clare_school.db"
    firebase_project_id: str = ""
    firebase_credentials_json: str = ""
    google_application_credentials: str = ""

    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "clare-media"
    r2_public_url: str = ""

    api_cors_origins: str = "http://localhost:3000"
    contact_email: str = "admissions@stclare.example"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""

    # Dev mode: skip Firebase verification when no credentials configured
    auth_dev_bypass: bool = True
    max_audio_bytes: int = 15 * 1024 * 1024
    signed_url_expires_seconds: int = 900

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.api_cors_origins.split(",") if o.strip()]

    @property
    def sqlalchemy_url(self) -> str:
        url = self.database_url
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
