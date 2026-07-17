"""Runtime setting model."""

from typing import Any

from pydantic import Field
from pymongo import ASCENDING, IndexModel

from app.models.base import BaseDocument

SettingValue = dict[str, Any] | list[Any] | str | int | float | bool | None


class Setting(BaseDocument):
    """Application setting document."""

    key: str = Field(min_length=1, max_length=120)
    value: SettingValue = None
    description: str | None = Field(default=None, max_length=500)
    is_public: bool = False

    class Settings:
        """Beanie collection settings."""

        name = "settings"
        use_state_management = True
        indexes = [
            IndexModel([("key", ASCENDING)], unique=True, name="uq_settings_key"),
            IndexModel([("is_public", ASCENDING)], name="idx_settings_is_public"),
            IndexModel([("deleted_at", ASCENDING)], name="idx_settings_deleted_at"),
        ]
