"""User management service."""

from app.auth.permissions import permissions_for_role
from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.user import UserUpdate
from app.utils.object_id import serialize_document


class UserService:
    """User CRUD workflows."""

    def __init__(self) -> None:
        self.users = UserRepository()

    async def list_users(self, skip: int, limit: int) -> tuple[list[dict], int]:
        """List users with total count."""

        users = await self.users.list(skip=skip, limit=limit)
        total = await self.users.count()
        return [serialize_document(user) for user in users], total

    async def get_user(self, user_id: str) -> dict:
        """Get a user by id."""

        user = await self.users.get(user_id)
        return serialize_document(user)

    async def update_user(self, user_id: str, payload: UserUpdate) -> dict:
        """Update a user."""

        update_data = payload.model_dump(exclude_unset=True)
        if "role" in update_data and update_data["role"] is not None:
            update_data["permissions"] = permissions_for_role(update_data["role"])
        user = await self.users.update(user_id, update_data)
        return serialize_document(user)

    async def delete_user(self, user_id: str) -> dict:
        """Soft delete a user."""

        user = await self.users.soft_delete(user_id)
        return serialize_document(user)

    async def update_profile(self, user: User, payload) -> dict:
        """Update the authenticated user's profile."""

        update_data = payload.model_dump(exclude_unset=True)
        updated = await self.users.update(str(user.id), update_data)
        return serialize_document(updated)
