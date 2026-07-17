"""Image asset routes."""

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.api.v1.dependencies.auth import (
    get_current_admin,
    get_current_user,
    require_permission,
)
from app.api.v1.dependencies.pagination import get_pagination
from app.core.responses import success_response
from app.models.user import User
from app.schemas.base import PaginationParams
from app.schemas.image import ImageUpdate
from app.services.image_service import ImageService

router = APIRouter(prefix="/images", tags=["images"])


@router.post("", status_code=status.HTTP_201_CREATED, summary="Upload image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Form(default="uploads"),
    user: User = Depends(require_permission("images:upload")),
):
    """Upload an image to Cloudinary and store metadata in MongoDB."""

    data = await ImageService().upload_image(
        file=file,
        folder=folder,
        uploaded_by=str(user.id),
    )
    return success_response(
        message="Image uploaded successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.get("", summary="List images")
async def list_images(
    pagination: PaginationParams = Depends(get_pagination),
    _: User = Depends(require_permission("images:read")),
):
    """List stored image metadata."""

    items, total = await ImageService().list_images(
        skip=pagination.skip,
        limit=pagination.page_size,
    )
    return success_response(
        message="Images retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.get("/{image_id}", summary="Get image")
async def get_image(
    image_id: str,
    _: User = Depends(get_current_user),
):
    """Get stored image metadata."""

    data = await ImageService().get_image(image_id)
    return success_response(message="Image retrieved successfully", data=data)


@router.patch("/{image_id}", summary="Update image")
async def update_image(
    image_id: str,
    payload: ImageUpdate,
    _: User = Depends(get_current_admin),
):
    """Update image metadata. Admin only."""

    data = await ImageService().update_image(image_id, payload)
    return success_response(message="Image updated successfully", data=data)


@router.post("/{image_id}/replace", summary="Replace image")
async def replace_image(
    image_id: str,
    file: UploadFile = File(...),
    _: User = Depends(get_current_admin),
):
    """Replace an image in Cloudinary. Admin only."""

    data = await ImageService().replace_image(image_id, file)
    return success_response(message="Image replaced successfully", data=data)


@router.get("/{image_id}/signed-url", summary="Generate signed image URL")
async def signed_url(
    image_id: str,
    _: User = Depends(get_current_user),
):
    """Generate a signed Cloudinary delivery URL."""

    data = await ImageService().signed_url(image_id)
    return success_response(message="Signed URL generated successfully", data=data)


@router.delete("/{image_id}", summary="Delete image")
async def delete_image(
    image_id: str,
    _: User = Depends(get_current_admin),
):
    """Delete an image from Cloudinary and soft-delete metadata. Admin only."""

    data = await ImageService().delete_image(image_id)
    return success_response(message="Image deleted successfully", data=data)
