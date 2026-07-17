"""Access token blocklist repository."""

from datetime import datetime

from app.core.enums import TokenType
from app.exceptions.exceptions import ConflictError
from app.models.auth_token import TokenBlocklist
from app.repositories.base import BaseRepository
from app.utils.datetime import utc_now


class TokenBlocklistRepository(BaseRepository[TokenBlocklist]):
    """Repository for blocklisted JWTs."""

    def __init__(self) -> None:
        super().__init__(TokenBlocklist)

    async def is_blocklisted(self, jti: str) -> bool:
        """Return whether a JTI is blocklisted and not expired."""

        token = await self.find_one(
            {
                "jti": jti,
                "expires_at": {"$gt": utc_now()},
            },
        )
        return token is not None

    async def blocklist(
        self,
        jti: str,
        expires_at: datetime,
        reason: str = "logout",
    ) -> None:
        """Blocklist an access token until it naturally expires."""

        try:
            await self.create(
                {
                    "jti": jti,
                    "token_type": TokenType.ACCESS,
                    "expires_at": expires_at,
                    "reason": reason,
                },
            )
        except ConflictError:
            return
