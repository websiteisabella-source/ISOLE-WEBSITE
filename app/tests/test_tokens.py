"""JWT helper tests."""

from datetime import UTC, datetime

import pytest
from pydantic import SecretStr

from app.auth.tokens import (
    create_access_token,
    create_random_token,
    create_refresh_token,
    decode_token,
    hash_token,
    jwt_exp_to_datetime,
)
from app.config.settings import Settings
from app.core.enums import TokenType, UserRole
from app.exceptions.exceptions import AuthenticationError


def test_access_token_roundtrip() -> None:
    """Access tokens should decode with the expected claims."""

    settings = Settings(
        JWT_SECRET_KEY=SecretStr("test-access-secret-key-with-more-than-32-characters"),
        JWT_REFRESH_SECRET_KEY=SecretStr("test-refresh-secret-key-with-more-than-32-characters"),
        CORS_ORIGINS="http://localhost:3000",
    )

    token, jti, _ = create_access_token("user-id", UserRole.ADMIN, settings=settings)
    payload = decode_token(token, TokenType.ACCESS, settings)

    assert payload["sub"] == "user-id"
    assert payload["jti"] == jti
    assert payload["role"] == UserRole.ADMIN.value


def test_refresh_token_roundtrip() -> None:
    """Refresh tokens should decode only as refresh tokens."""

    settings = Settings(
        JWT_SECRET_KEY=SecretStr("test-access-secret-key-with-more-than-32-characters"),
        JWT_REFRESH_SECRET_KEY=SecretStr("test-refresh-secret-key-with-more-than-32-characters"),
        CORS_ORIGINS="http://localhost:3000",
    )

    token, jti, _ = create_refresh_token("user-id", settings=settings)
    payload = decode_token(token, TokenType.REFRESH, settings)

    assert payload["sub"] == "user-id"
    assert payload["jti"] == jti

    with pytest.raises(AuthenticationError):
        decode_token(token, TokenType.ACCESS, settings)


def test_hash_token_is_deterministic_and_not_plaintext() -> None:
    """Token hashes should be stable and irreversible for storage."""

    token = "secret-token"

    assert hash_token(token) == hash_token(token)
    assert hash_token(token) != token


def test_random_token_and_exp_conversion() -> None:
    """Opaque tokens and expiration conversion should be stable."""

    raw = create_random_token()
    now = datetime.now(tz=UTC)

    assert len(raw) > 20
    assert jwt_exp_to_datetime(now) == now
    assert jwt_exp_to_datetime(now.timestamp()).tzinfo == UTC
