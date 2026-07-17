"""Authentication token persistence models."""

from datetime import datetime

from pydantic import Field
from pymongo import ASCENDING, IndexModel

from app.core.enums import TokenType
from app.models.base import BaseDocument
from app.utils.datetime import utc_now


class RefreshToken(BaseDocument):
    """Refresh token record for rotation and logout."""

    user_id: str
    token_hash: str
    jti: str
    expires_at: datetime
    revoked_at: datetime | None = None

    @property
    def is_valid(self) -> bool:
        """Return whether the refresh token can still be used."""

        return self.revoked_at is None and self.expires_at > utc_now() and self.deleted_at is None

    class Settings:
        """Beanie collection settings."""

        name = "refresh_tokens"
        use_state_management = True
        indexes = [
            IndexModel(
                [("token_hash", ASCENDING)],
                unique=True,
                name="uq_refresh_tokens_token_hash",
            ),
            IndexModel([("user_id", ASCENDING)], name="idx_refresh_tokens_user_id"),
            IndexModel([("expires_at", ASCENDING)], name="idx_refresh_tokens_expires_at"),
        ]


class TokenBlocklist(BaseDocument):
    """Blocklisted access tokens that should be rejected until expiration."""

    jti: str
    token_type: TokenType = TokenType.ACCESS
    expires_at: datetime
    reason: str = Field(default="logout", max_length=120)

    class Settings:
        """Beanie collection settings."""

        name = "token_blocklist"
        use_state_management = True
        indexes = [
            IndexModel([("jti", ASCENDING)], unique=True, name="uq_token_blocklist_jti"),
            IndexModel([("expires_at", ASCENDING)], name="idx_token_blocklist_expires_at"),
        ]


class PasswordResetToken(BaseDocument):
    """Password reset token record."""

    user_id: str
    token_hash: str
    expires_at: datetime
    used_at: datetime | None = None

    @property
    def is_valid(self) -> bool:
        """Return whether the reset token can still be used."""

        return self.used_at is None and self.expires_at > utc_now() and self.deleted_at is None

    class Settings:
        """Beanie collection settings."""

        name = "password_reset_tokens"
        use_state_management = True
        indexes = [
            IndexModel(
                [("token_hash", ASCENDING)],
                unique=True,
                name="uq_password_reset_tokens_token_hash",
            ),
            IndexModel([("user_id", ASCENDING)], name="idx_password_reset_tokens_user_id"),
            IndexModel([("expires_at", ASCENDING)], name="idx_password_reset_tokens_expires_at"),
        ]


class EmailVerificationToken(BaseDocument):
    """Email verification token record."""

    user_id: str
    token_hash: str
    expires_at: datetime
    used_at: datetime | None = None

    @property
    def is_valid(self) -> bool:
        """Return whether the verification token can still be used."""

        return self.used_at is None and self.expires_at > utc_now() and self.deleted_at is None

    class Settings:
        """Beanie collection settings."""

        name = "email_verification_tokens"
        use_state_management = True
        indexes = [
            IndexModel(
                [("token_hash", ASCENDING)],
                unique=True,
                name="uq_email_verification_tokens_token_hash",
            ),
            IndexModel([("user_id", ASCENDING)], name="idx_email_verification_tokens_user_id"),
            IndexModel(
                [("expires_at", ASCENDING)], name="idx_email_verification_tokens_expires_at"
            ),
        ]
