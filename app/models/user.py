"""User document model."""

from datetime import datetime

from pydantic import EmailStr, Field
from pymongo import ASCENDING, IndexModel

from app.core.enums import UserRole
from app.models.base import BaseDocument


class User(BaseDocument):
    """Application user."""

    email: EmailStr
    hashed_password: str
    first_name: str | None = Field(default=None, max_length=80)
    last_name: str | None = Field(default=None, max_length=80)
    role: UserRole = UserRole.USER
    permissions: list[str] = Field(default_factory=list)
    is_verified: bool = False
    last_login_at: datetime | None = None

    class Settings:
        """Beanie collection settings."""

        name = "users"
        use_state_management = True
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True, name="uq_users_email"),
            IndexModel([("role", ASCENDING)], name="idx_users_role"),
            IndexModel([("deleted_at", ASCENDING)], name="idx_users_deleted_at"),
        ]
