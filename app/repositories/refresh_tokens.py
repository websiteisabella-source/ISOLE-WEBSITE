"""Refresh token repository."""

from app.models.auth_token import RefreshToken
from app.repositories.base import BaseRepository
from app.utils.datetime import utc_now


class RefreshTokenRepository(BaseRepository[RefreshToken]):
    """Repository for refresh tokens."""

    def __init__(self) -> None:
        super().__init__(RefreshToken)

    async def get_active_by_hash(self, token_hash: str) -> RefreshToken | None:
        """Find a valid refresh token by hash."""

        return await self.find_one(
            {
                "token_hash": token_hash,
                "revoked_at": None,
                "expires_at": {"$gt": utc_now()},
            },
        )

    async def revoke(self, token: RefreshToken) -> RefreshToken:
        """Revoke a refresh token."""

        token.revoked_at = utc_now()
        token.updated_at = utc_now()
        await token.save()
        return token

    async def revoke_all_for_user(self, user_id: str) -> None:
        """Revoke all active refresh tokens for a user."""

        active_tokens = await self.list(
            limit=1000,
            filters={"user_id": user_id, "revoked_at": None},
        )
        for token in active_tokens:
            token.revoked_at = utc_now()
            token.updated_at = utc_now()
            await token.save()
