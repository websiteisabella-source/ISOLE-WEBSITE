"""Settings validation tests."""

import pytest
from pydantic import ValidationError

from app.config.settings import Settings


def test_settings_parse_cors_and_properties() -> None:
    """Settings should parse CORS and expose convenience properties."""

    settings = Settings(
        CORS_ORIGINS="http://localhost:3000, http://127.0.0.1:3000",
        MAX_UPLOAD_SIZE_MB=2,
    )

    assert settings.cors_origins == [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    assert not settings.is_production
    assert settings.max_upload_size_bytes == 2 * 1024 * 1024


def test_settings_parse_cloudinary_url() -> None:
    """Settings should derive Cloudinary credentials from CLOUDINARY_URL."""

    settings = Settings(
        _env_file=None,
        CLOUDINARY_URL="cloudinary://sample-key:sample-secret@sguhbpc0",
    )

    assert settings.cloudinary_cloud_name == "sguhbpc0"
    assert settings.cloudinary_api_key == "sample-key"
    assert settings.cloudinary_api_secret.get_secret_value() == "sample-secret"


def test_production_rejects_weak_jwt_secret() -> None:
    """Production settings should reject weak secrets."""

    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="production",
            JWT_SECRET_KEY="short",
            JWT_REFRESH_SECRET_KEY="also-short",
            CORS_ORIGINS="https://example.com",
        )


def test_production_rejects_wildcard_cors() -> None:
    """Production settings should require explicit CORS origins."""

    with pytest.raises(ValidationError):
        Settings(
            ENVIRONMENT="production",
            JWT_SECRET_KEY="strong-access-secret-key-with-more-than-32-characters",
            JWT_REFRESH_SECRET_KEY="strong-refresh-secret-key-with-more-than-32-characters",
            CORS_ORIGINS="*",
        )
