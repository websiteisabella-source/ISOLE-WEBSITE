"""Security configuration view."""

from pydantic import BaseModel

from app.config.settings import get_settings


class SecuritySettings(BaseModel):
    """JWT and throttling settings consumed by security components."""

    jwt_secret_key: str
    jwt_refresh_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    rate_limit_requests: int
    rate_limit_window_seconds: int
    auth_rate_limit_requests: int
    auth_rate_limit_window_seconds: int


def get_security_settings() -> SecuritySettings:
    """Return validated security settings without exposing SecretStr objects."""

    settings = get_settings()
    return SecuritySettings(
        jwt_secret_key=settings.jwt_secret_key.get_secret_value(),
        jwt_refresh_secret_key=settings.jwt_refresh_secret_key.get_secret_value(),
        jwt_algorithm=settings.jwt_algorithm,
        access_token_expire_minutes=settings.access_token_expire_minutes,
        refresh_token_expire_days=settings.refresh_token_expire_days,
        rate_limit_requests=settings.rate_limit_requests,
        rate_limit_window_seconds=settings.rate_limit_window_seconds,
        auth_rate_limit_requests=settings.auth_rate_limit_requests,
        auth_rate_limit_window_seconds=settings.auth_rate_limit_window_seconds,
    )
