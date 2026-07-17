"""Password reset token repository."""

from app.models.auth_token import PasswordResetToken
from app.repositories.base import BaseRepository
from app.utils.datetime import utc_now


class PasswordResetTokenRepository(BaseRepository[PasswordResetToken]):
    """Repository for password reset tokens."""

    def __init__(self) -> None:
        super().__init__(PasswordResetToken)

    async def get_valid_by_hash(self, token_hash: str) -> PasswordResetToken | None:
        """Find a valid password reset token."""

        return await self.find_one(
            {
                "token_hash": token_hash,
                "used_at": None,
                "expires_at": {"$gt": utc_now()},
            },
        )

    async def mark_used(self, token: PasswordResetToken) -> PasswordResetToken:
        """Mark a reset token as used."""

        token.used_at = utc_now()
        token.updated_at = utc_now()
        await token.save()
        return token
