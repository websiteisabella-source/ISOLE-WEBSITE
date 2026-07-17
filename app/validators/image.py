"""Image upload validation helpers."""

from fastapi import UploadFile

from app.config.settings import Settings
from app.core.constants import ALLOWED_IMAGE_MIME_TYPES
from app.exceptions.exceptions import ValidationAppError
from app.schemas.base import ErrorDetail


def validate_image_upload(file: UploadFile, settings: Settings) -> None:
    """Validate incoming image metadata before reading the upload stream."""

    if file.content_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise ValidationAppError(
            message="Invalid image file",
            errors=[
                ErrorDetail(
                    field="file",
                    message="Only jpeg, png, webp, and gif images are allowed",
                    code="invalid_mime_type",
                ),
            ],
        )
    if not file.filename:
        raise ValidationAppError(
            message="Invalid image file",
            errors=[
                ErrorDetail(
                    field="file",
                    message="A filename is required",
                    code="missing_filename",
                ),
            ],
        )
