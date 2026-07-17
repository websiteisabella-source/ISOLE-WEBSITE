"""User repository."""

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for users."""

    def __init__(self) -> None:
        super().__init__(User)

    async def get_by_email(self, email: str) -> User | None:
        """Find an active user by email."""

        return await self.find_one({"email": email.lower()})
