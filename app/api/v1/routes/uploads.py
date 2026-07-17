"""Upload aliases for image workflows."""

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.api.v1.dependencies.auth import require_permission
from app.core.responses import success_response
from app.models.user import User
from app.services.image_service import ImageService

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("", status_code=status.HTTP_201_CREATED, summary="Upload image")
async def upload(
    file: UploadFile = File(...),
    folder: str = Form(default="uploads"),
    user: User = Depends(require_permission("images:upload")),
):
    """Upload an image through the uploads endpoint."""

    data = await ImageService().upload_image(
        file=file,
        folder=folder,
        uploaded_by=str(user.id),
    )
    return success_response(
        message="Upload completed successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )
