"""Runtime setting service."""

from app.exceptions.exceptions import NotFoundError
from app.repositories.settings import SettingRepository
from app.schemas.setting import SettingCreate, SettingUpdate
from app.utils.object_id import serialize_document


class SettingService:
    """Setting CRUD workflows."""

    def __init__(self) -> None:
        self.settings = SettingRepository()

    async def create_setting(self, payload: SettingCreate) -> dict:
        """Create a setting."""

        setting = await self.settings.create(payload.model_dump())
        return serialize_document(setting)

    async def list_settings(
        self,
        skip: int,
        limit: int,
        public_only: bool = False,
    ) -> tuple[list[dict], int]:
        """List settings."""

        filters = {"is_public": True} if public_only else None
        settings = await self.settings.list(skip=skip, limit=limit, filters=filters)
        total = await self.settings.count(filters=filters)
        return [serialize_document(setting) for setting in settings], total

    async def get_setting(self, setting_id: str) -> dict:
        """Get a setting by id."""

        setting = await self.settings.get(setting_id)
        return serialize_document(setting)

    async def get_public_setting_by_key(self, key: str) -> dict:
        """Get a public setting by key."""

        setting = await self.settings.get_by_key(key)
        if setting is None or not setting.is_public:
            raise NotFoundError("Setting not found")
        return serialize_document(setting)

    async def update_setting(self, setting_id: str, payload: SettingUpdate) -> dict:
        """Update a setting."""

        setting = await self.settings.update(
            setting_id,
            payload.model_dump(exclude_unset=True),
        )
        return serialize_document(setting)

    async def delete_setting(self, setting_id: str) -> dict:
        """Soft delete a setting."""

        setting = await self.settings.soft_delete(setting_id)
        return serialize_document(setting)
