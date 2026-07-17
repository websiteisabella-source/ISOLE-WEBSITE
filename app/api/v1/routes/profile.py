"""Authenticated profile routes."""

from fastapi import APIRouter, Depends

from app.api.v1.dependencies.auth import get_current_user
from app.core.responses import success_response
from app.models.user import User
from app.schemas.user import ChangePasswordRequest, ProfileUpdate
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.utils.object_id import serialize_document

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", summary="Get profile")
async def get_profile(user: User = Depends(get_current_user)):
    """Return the current user's profile."""

    return success_response(
        message="Profile retrieved successfully",
        data=serialize_document(user),
    )


@router.patch("", summary="Update profile")
async def update_profile(
    payload: ProfileUpdate,
    user: User = Depends(get_current_user),
):
    """Update the current user's profile."""

    data = await UserService().update_profile(user, payload)
    return success_response(message="Profile updated successfully", data=data)


@router.post("/change-password", summary="Change password")
async def change_password(
    payload: ChangePasswordRequest,
    user: User = Depends(get_current_user),
):
    """Change the current user's password."""

    await AuthService().change_password(user, payload)
    return success_response(message="Password changed successfully", data={})
