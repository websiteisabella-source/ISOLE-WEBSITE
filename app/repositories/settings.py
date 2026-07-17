"""Setting repository."""

from app.models.setting import Setting
from app.repositories.base import BaseRepository


class SettingRepository(BaseRepository[Setting]):
    """Repository for runtime settings."""

    def __init__(self) -> None:
        super().__init__(Setting)

    async def get_by_key(self, key: str) -> Setting | None:
        """Find a setting by key."""

        return await self.find_one({"key": key})
