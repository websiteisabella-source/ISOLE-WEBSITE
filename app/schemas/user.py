"""User schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.enums import UserRole
from app.schemas.base import TimestampedRead
from app.validators.common import validate_password_strength
from app.validators.security import sanitize_text


class UserBase(BaseModel):
    """Shared user fields."""

    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    first_name: str | None = Field(default=None, max_length=80)
    last_name: str | None = Field(default=None, max_length=80)

    @field_validator("first_name", "last_name")
    @classmethod
    def sanitize_optional_names(cls, value: str | None) -> str | None:
        """Sanitize optional display names."""

        return sanitize_text(value) if value else value


class UserCreate(UserBase):
    """Payload to create a user."""

    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """Validate password strength."""

        return validate_password_strength(value)


class UserUpdate(BaseModel):
    """Payload to update a user."""

    model_config = ConfigDict(extra="forbid")

    first_name: str | None = Field(default=None, max_length=80)
    last_name: str | None = Field(default=None, max_length=80)
    is_active: bool | None = None

    @field_validator("first_name", "last_name")
    @classmethod
    def sanitize_optional_names(cls, value: str | None) -> str | None:
        """Sanitize optional display names."""

        return sanitize_text(value) if value else value


class ProfileUpdate(BaseModel):
    """Payload to update the current user's profile."""

    model_config = ConfigDict(extra="forbid")

    first_name: str | None = Field(default=None, max_length=80)
    last_name: str | None = Field(default=None, max_length=80)

    @field_validator("first_name", "last_name")
    @classmethod
    def sanitize_optional_names(cls, value: str | None) -> str | None:
        """Sanitize optional display names."""

        return sanitize_text(value) if value else value


class ChangePasswordRequest(BaseModel):
    """Payload to change an authenticated user's password."""

    model_config = ConfigDict(extra="forbid")

    current_password: str
    new_password: str = Field(min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        """Validate the new password strength."""

        return validate_password_strength(value)


class UserRead(TimestampedRead):
    """Public user representation."""

    model_config = ConfigDict(from_attributes=True)

    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    role: UserRole
    permissions: list[str] = Field(default_factory=list)
    is_verified: bool
    last_login_at: datetime | None = None
