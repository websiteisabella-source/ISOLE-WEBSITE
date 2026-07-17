"""Setting schemas."""

from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.schemas.base import TimestampedRead
from app.validators.security import reject_nosql_injection, sanitize_text

SettingPayloadValue = dict[str, Any] | list[Any] | str | int | float | bool | None


class SettingCreate(BaseModel):
    """Payload to create a setting."""

    key: str = Field(min_length=1, max_length=120)
    value: SettingPayloadValue = None
    description: str | None = Field(default=None, max_length=500)
    is_public: bool = False

    @field_validator("key", "description")
    @classmethod
    def sanitize_strings(cls, value: str | None) -> str | None:
        """Sanitize setting strings."""

        return sanitize_text(value) if value else value

    @field_validator("value")
    @classmethod
    def validate_value(cls, value: SettingPayloadValue) -> SettingPayloadValue:
        """Reject query operators in setting values."""

        reject_nosql_injection(value, "value")
        return value


class SettingUpdate(BaseModel):
    """Payload to update a setting."""

    value: SettingPayloadValue = None
    description: str | None = Field(default=None, max_length=500)
    is_public: bool | None = None
    is_active: bool | None = None

    @field_validator("description")
    @classmethod
    def sanitize_description(cls, value: str | None) -> str | None:
        """Sanitize setting descriptions."""

        return sanitize_text(value) if value else value

    @field_validator("value")
    @classmethod
    def validate_value(cls, value: SettingPayloadValue) -> SettingPayloadValue:
        """Reject query operators in setting values."""

        reject_nosql_injection(value, "value")
        return value


class SettingRead(TimestampedRead):
    """Setting response."""

    key: str
    value: SettingPayloadValue = None
    description: str | None = None
    is_public: bool
