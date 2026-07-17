"""Runtime settings routes."""

from fastapi import APIRouter, Depends, status

from app.api.v1.dependencies.auth import get_current_admin
from app.api.v1.dependencies.pagination import get_pagination
from app.core.responses import success_response
from app.models.user import User
from app.schemas.base import PaginationParams
from app.schemas.setting import SettingCreate, SettingUpdate
from app.services.setting_service import SettingService

router = APIRouter(prefix="/settings", tags=["settings"])


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create setting")
async def create_setting(
    payload: SettingCreate,
    _: User = Depends(get_current_admin),
):
    """Create a setting. Admin only."""

    data = await SettingService().create_setting(payload)
    return success_response(
        message="Setting created successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.get("", summary="List settings")
async def list_settings(
    pagination: PaginationParams = Depends(get_pagination),
    _: User = Depends(get_current_admin),
):
    """List settings. Admin only."""

    items, total = await SettingService().list_settings(
        skip=pagination.skip,
        limit=pagination.page_size,
    )
    return success_response(
        message="Settings retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.get("/public", summary="List public settings")
async def list_public_settings(pagination: PaginationParams = Depends(get_pagination)):
    """List public settings."""

    items, total = await SettingService().list_settings(
        skip=pagination.skip,
        limit=pagination.page_size,
        public_only=True,
    )
    return success_response(
        message="Public settings retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.get("/public/{key}", summary="Get public setting")
async def get_public_setting(key: str):
    """Get a public setting by key."""

    data = await SettingService().get_public_setting_by_key(key)
    return success_response(message="Public setting retrieved successfully", data=data)


@router.get("/{setting_id}", summary="Get setting")
async def get_setting(setting_id: str, _: User = Depends(get_current_admin)):
    """Get a setting by id. Admin only."""

    data = await SettingService().get_setting(setting_id)
    return success_response(message="Setting retrieved successfully", data=data)


@router.patch("/{setting_id}", summary="Update setting")
async def update_setting(
    setting_id: str,
    payload: SettingUpdate,
    _: User = Depends(get_current_admin),
):
    """Update a setting. Admin only."""

    data = await SettingService().update_setting(setting_id, payload)
    return success_response(message="Setting updated successfully", data=data)


@router.delete("/{setting_id}", summary="Delete setting")
async def delete_setting(
    setting_id: str,
    _: User = Depends(get_current_admin),
):
    """Soft delete a setting. Admin only."""

    data = await SettingService().delete_setting(setting_id)
    return success_response(message="Setting deleted successfully", data=data)
