"""Email verification token repository."""

from app.models.auth_token import EmailVerificationToken
from app.repositories.base import BaseRepository
from app.utils.datetime import utc_now


class EmailVerificationTokenRepository(BaseRepository[EmailVerificationToken]):
    """Repository for email verification tokens."""

    def __init__(self) -> None:
        super().__init__(EmailVerificationToken)

    async def get_valid_by_hash(self, token_hash: str) -> EmailVerificationToken | None:
        """Find a valid email verification token."""

        return await self.find_one(
            {
                "token_hash": token_hash,
                "used_at": None,
                "expires_at": {"$gt": utc_now()},
            },
        )

    async def mark_used(self, token: EmailVerificationToken) -> EmailVerificationToken:
        """Mark a verification token as used."""

        token.used_at = utc_now()
        token.updated_at = utc_now()
        await token.save()
        return token
