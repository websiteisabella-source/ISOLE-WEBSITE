"""Typed environment settings for the API."""

from functools import lru_cache
from pathlib import Path
from typing import Annotated, Literal
from urllib.parse import unquote, urlparse

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = Field(default="ISOLE API", alias="APP_NAME")
    environment: Literal["development", "testing", "staging", "production"] = Field(
        default="development",
        alias="ENVIRONMENT",
    )
    debug: bool = Field(default=False, alias="DEBUG")
    api_docs_enabled: bool = Field(default=False, alias="API_DOCS_ENABLED")
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT", ge=1, le=65535)

    mongodb_uri: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URI")
    database_name: str = Field(default="isole_showroom", alias="DATABASE_NAME")

    jwt_secret_key: SecretStr = Field(
        default=SecretStr("change-me-access-token-secret-key"),
        alias="JWT_SECRET_KEY",
    )
    jwt_refresh_secret_key: SecretStr = Field(
        default=SecretStr("change-me-refresh-token-secret-key"),
        alias="JWT_REFRESH_SECRET_KEY",
    )
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=30,
        alias="ACCESS_TOKEN_EXPIRE_MINUTES",
        ge=1,
    )
    refresh_token_expire_days: int = Field(
        default=14,
        alias="REFRESH_TOKEN_EXPIRE_DAYS",
        ge=1,
    )

    cloudinary_cloud_name: str = Field(default="", alias="CLOUDINARY_CLOUD_NAME")
    cloudinary_api_key: str = Field(default="", alias="CLOUDINARY_API_KEY")
    cloudinary_api_secret: SecretStr = Field(
        default=SecretStr(""),
        alias="CLOUDINARY_API_SECRET",
    )
    cloudinary_url: SecretStr = Field(default=SecretStr(""), alias="CLOUDINARY_URL")

    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=list,
        alias="CORS_ORIGINS",
    )
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_dir: Path = Field(default=Path("logs"), alias="LOG_DIR")

    rate_limit_requests: int = Field(default=120, alias="RATE_LIMIT_REQUESTS", ge=1)
    rate_limit_window_seconds: int = Field(
        default=60,
        alias="RATE_LIMIT_WINDOW_SECONDS",
        ge=1,
    )
    auth_rate_limit_requests: int = Field(default=10, alias="AUTH_RATE_LIMIT_REQUESTS", ge=1)
    auth_rate_limit_window_seconds: int = Field(
        default=300,
        alias="AUTH_RATE_LIMIT_WINDOW_SECONDS",
        ge=1,
    )
    max_upload_size_mb: int = Field(default=10, alias="MAX_UPLOAD_SIZE_MB", ge=1)
    initial_admin_bootstrap_enabled: bool = Field(
        default=False,
        alias="INITIAL_ADMIN_BOOTSTRAP_ENABLED",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str] | None) -> list[str]:
        """Parse comma-separated CORS origins from environment variables."""

        if value is None or value == "":
            return []
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("log_level")
    @classmethod
    def normalize_log_level(cls, value: str) -> str:
        """Normalize log level names for the logging module."""

        return value.upper()

    @field_validator("jwt_algorithm")
    @classmethod
    def validate_jwt_algorithm(cls, value: str) -> str:
        """Restrict JWT signing to expected HMAC algorithms."""

        algorithm = value.upper()
        if algorithm not in {"HS256", "HS384", "HS512"}:
            raise ValueError("JWT_ALGORITHM must be one of HS256, HS384, or HS512")
        return algorithm

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Reject unsafe production configuration."""

        self.apply_cloudinary_url()
        if self.environment == "production":
            access_secret = self.jwt_secret_key.get_secret_value()
            refresh_secret = self.jwt_refresh_secret_key.get_secret_value()
            if self.debug:
                raise ValueError("DEBUG must be false in production")
            if self.api_docs_enabled:
                raise ValueError("API_DOCS_ENABLED must be false in production")
            if self.initial_admin_bootstrap_enabled:
                raise ValueError("INITIAL_ADMIN_BOOTSTRAP_ENABLED must be false in production")
            if "change-me" in access_secret or len(access_secret) < 32:
                raise ValueError("JWT_SECRET_KEY must be a strong production secret")
            if "change-me" in refresh_secret or len(refresh_secret) < 32:
                raise ValueError("JWT_REFRESH_SECRET_KEY must be a strong production secret")
            if access_secret == refresh_secret:
                raise ValueError("JWT access and refresh secrets must be different")
            if not self.cors_origins:
                raise ValueError("CORS_ORIGINS must be explicit in production")
            if "*" in self.cors_origins:
                raise ValueError("Wildcard CORS is not allowed in production")
            for origin in self.cors_origins:
                parsed = urlparse(origin)
                if parsed.scheme != "https" or not parsed.netloc:
                    raise ValueError("Production CORS origins must be absolute HTTPS URLs")
        return self

    def apply_cloudinary_url(self) -> None:
        """Derive Cloudinary settings from CLOUDINARY_URL when provided."""

        raw_url = self.cloudinary_url.get_secret_value()
        if not raw_url:
            return

        parsed = urlparse(raw_url)
        if (
            parsed.scheme != "cloudinary"
            or not parsed.username
            or not parsed.password
            or not parsed.hostname
        ):
            raise ValueError("CLOUDINARY_URL must use cloudinary://api_key:api_secret@cloud_name")

        if not self.cloudinary_cloud_name:
            self.cloudinary_cloud_name = parsed.hostname
        if not self.cloudinary_api_key:
            self.cloudinary_api_key = unquote(parsed.username)
        if not self.cloudinary_api_secret.get_secret_value():
            self.cloudinary_api_secret = SecretStr(unquote(parsed.password))

    @property
    def is_production(self) -> bool:
        """Return whether the application is running in production."""

        return self.environment == "production"

    @property
    def max_upload_size_bytes(self) -> int:
        """Return the maximum accepted upload size in bytes."""

        return self.max_upload_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    """Return cached settings for dependency injection."""

    return Settings()
