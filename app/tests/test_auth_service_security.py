"""Authentication service security tests."""

from typing import Any, cast
from unittest.mock import AsyncMock

import pytest

from app.config.settings import Settings
from app.core.enums import UserRole
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService


class FakeUsers:
    """Minimal user repository double for registration tests."""

    def __init__(self) -> None:
        self.created_data: dict | None = None

    async def get_by_email(self, _: str):
        """Return no existing user."""

        return None

    async def count(self) -> int:
        """Simulate an empty users collection."""

        return 0

    async def create(self, data: dict):
        """Capture created user data and return a user-like object."""

        self.created_data = data
        return CreatedUser(data)


class CreatedUser:
    """Minimal serializable user double."""

    id = "user-id"

    def __init__(self, data: dict) -> None:
        self.data = data
        self.email = data["email"]
        self.role = data["role"]
        self.permissions = data["permissions"]

    def model_dump(self, mode: str = "json") -> dict:
        """Return user-like serialized data."""

        return {**self.data, "id": self.id}


@pytest.mark.asyncio
async def test_first_registration_defaults_to_user_without_bootstrap() -> None:
    """The public register endpoint must not create an admin by default."""

    service = AuthService(settings=Settings(_env_file=None))
    fake_users = FakeUsers()
    service_any = cast(Any, service)
    service_any.users = fake_users
    service_any.create_email_verification_token = AsyncMock(return_value="verification-token")
    service_any._issue_token_pair = AsyncMock(return_value={"access_token": "token"})

    await service.register(
        RegisterRequest(
            email="first@example.com",
            password="StrongPass123",
        )
    )

    assert fake_users.created_data is not None
    assert fake_users.created_data["role"] == UserRole.USER


@pytest.mark.asyncio
async def test_first_registration_can_bootstrap_admin_when_explicitly_enabled() -> None:
    """Local-only bootstrap remains available when intentionally enabled."""

    service = AuthService(settings=Settings(_env_file=None, INITIAL_ADMIN_BOOTSTRAP_ENABLED=True))
    fake_users = FakeUsers()
    service_any = cast(Any, service)
    service_any.users = fake_users
    service_any.create_email_verification_token = AsyncMock(return_value="verification-token")
    service_any._issue_token_pair = AsyncMock(return_value={"access_token": "token"})

    await service.register(
        RegisterRequest(
            email="first@example.com",
            password="StrongPass123",
        )
    )

    assert fake_users.created_data is not None
    assert fake_users.created_data["role"] == UserRole.ADMIN
