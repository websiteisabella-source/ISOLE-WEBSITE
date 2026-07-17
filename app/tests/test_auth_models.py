"""Authentication model behavior tests."""

from datetime import timedelta

from app.core.enums import TokenType
from app.models.auth_token import (
    EmailVerificationToken,
    PasswordResetToken,
    RefreshToken,
    TokenBlocklist,
)
from app.utils.datetime import utc_now


def test_refresh_token_validity_property() -> None:
    """Refresh tokens should reflect expiration and revocation state."""

    token = RefreshToken.model_construct(
        user_id="user-id",
        token_hash="hash",
        jti="jti",
        expires_at=utc_now() + timedelta(minutes=5),
    )
    assert token.is_valid

    token.revoked_at = utc_now()
    assert not token.is_valid


def test_password_reset_token_validity_property() -> None:
    """Password reset tokens should become invalid after use."""

    token = PasswordResetToken.model_construct(
        user_id="user-id",
        token_hash="hash",
        expires_at=utc_now() + timedelta(minutes=5),
    )
    assert token.is_valid

    token.used_at = utc_now()
    assert not token.is_valid


def test_email_verification_token_validity_property() -> None:
    """Email verification tokens should expire."""

    token = EmailVerificationToken.model_construct(
        user_id="user-id",
        token_hash="hash",
        expires_at=utc_now() - timedelta(minutes=5),
    )

    assert not token.is_valid


def test_token_blocklist_defaults_to_access_type() -> None:
    """Blocklist records should default to access tokens."""

    token = TokenBlocklist.model_construct(
        jti="jti",
        expires_at=utc_now() + timedelta(minutes=5),
    )

    assert token.token_type == TokenType.ACCESS
