"""User management routes."""

from fastapi import APIRouter, Depends, status

from app.api.v1.dependencies.auth import get_current_admin
from app.api.v1.dependencies.pagination import get_pagination
from app.core.responses import success_response
from app.models.user import User
from app.schemas.base import PaginationParams
from app.schemas.user import UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", summary="List users")
async def list_users(
    pagination: PaginationParams = Depends(get_pagination),
    _: User = Depends(get_current_admin),
):
    """List users. Admin only."""

    items, total = await UserService().list_users(
        skip=pagination.skip,
        limit=pagination.page_size,
    )
    return success_response(
        message="Users retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.get("/{user_id}", summary="Get user")
async def get_user(user_id: str, _: User = Depends(get_current_admin)):
    """Get a user by id. Admin only."""

    data = await UserService().get_user(user_id)
    return success_response(message="User retrieved successfully", data=data)


@router.patch("/{user_id}", summary="Update user")
async def update_user(
    user_id: str,
    payload: UserUpdate,
    _: User = Depends(get_current_admin),
):
    """Update a user. Admin only."""

    data = await UserService().update_user(user_id, payload)
    return success_response(message="User updated successfully", data=data)


@router.delete("/{user_id}", status_code=status.HTTP_200_OK, summary="Delete user")
async def delete_user(user_id: str, _: User = Depends(get_current_admin)):
    """Soft delete a user. Admin only."""

    data = await UserService().delete_user(user_id)
    return success_response(message="User deleted successfully", data=data)
