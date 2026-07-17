"""JWT creation, decoding, and token hashing."""

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

import jwt
from jwt import InvalidTokenError

from app.auth.permissions import permissions_for_role
from app.config.settings import Settings, get_settings
from app.core.enums import TokenType, UserRole
from app.exceptions.exceptions import AuthenticationError


def hash_token(token: str) -> str:
    """Hash a token before storing it."""

    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_random_token() -> str:
    """Create a cryptographically secure opaque token."""

    return secrets.token_urlsafe(48)


def _encode(payload: dict[str, Any], secret: str, settings: Settings) -> str:
    """Encode a JWT payload."""

    return jwt.encode(payload, secret, algorithm=settings.jwt_algorithm)


def create_access_token(
    user_id: str,
    role: UserRole,
    permissions: list[str] | None = None,
    settings: Settings | None = None,
) -> tuple[str, str, datetime]:
    """Create an access token and return token, jti, and expiration."""

    resolved_settings = settings or get_settings()
    expires_at = datetime.now(tz=UTC) + timedelta(
        minutes=resolved_settings.access_token_expire_minutes,
    )
    jti = str(uuid4())
    payload = {
        "sub": user_id,
        "type": TokenType.ACCESS.value,
        "role": role.value,
        "permissions": permissions or permissions_for_role(role),
        "jti": jti,
        "iat": datetime.now(tz=UTC),
        "exp": expires_at,
    }
    token = _encode(
        payload,
        resolved_settings.jwt_secret_key.get_secret_value(),
        resolved_settings,
    )
    return token, jti, expires_at


def create_refresh_token(
    user_id: str,
    settings: Settings | None = None,
) -> tuple[str, str, datetime]:
    """Create a refresh token and return token, jti, and expiration."""

    resolved_settings = settings or get_settings()
    expires_at = datetime.now(tz=UTC) + timedelta(
        days=resolved_settings.refresh_token_expire_days,
    )
    jti = str(uuid4())
    payload = {
        "sub": user_id,
        "type": TokenType.REFRESH.value,
        "jti": jti,
        "iat": datetime.now(tz=UTC),
        "exp": expires_at,
    }
    token = _encode(
        payload,
        resolved_settings.jwt_refresh_secret_key.get_secret_value(),
        resolved_settings,
    )
    return token, jti, expires_at


def decode_token(
    token: str,
    expected_type: TokenType,
    settings: Settings | None = None,
) -> dict[str, Any]:
    """Decode and validate a JWT."""

    resolved_settings = settings or get_settings()
    secret = (
        resolved_settings.jwt_refresh_secret_key.get_secret_value()
        if expected_type == TokenType.REFRESH
        else resolved_settings.jwt_secret_key.get_secret_value()
    )
    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=[resolved_settings.jwt_algorithm],
            options={"require": ["exp", "iat", "jti", "sub", "type"]},
        )
    except InvalidTokenError as exc:
        raise AuthenticationError("Invalid or expired token") from exc

    if payload.get("type") != expected_type.value:
        raise AuthenticationError("Invalid token type")
    return payload


def jwt_exp_to_datetime(exp: int | float | datetime) -> datetime:
    """Convert a JWT exp claim to a UTC datetime."""

    if isinstance(exp, datetime):
        return exp if exp.tzinfo else exp.replace(tzinfo=UTC)
    return datetime.fromtimestamp(exp, tz=UTC)
