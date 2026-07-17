"""Image upload validation helpers."""

import re

from fastapi import UploadFile

from app.config.settings import Settings
from app.core.constants import ALLOWED_IMAGE_MIME_TYPES
from app.exceptions.exceptions import ValidationAppError
from app.schemas.base import ErrorDetail

CLOUDINARY_FOLDER_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9/_-]{0,119}$")


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


def validate_cloudinary_folder(folder: str) -> str:
    """Normalize and validate user-provided Cloudinary folder names."""

    normalized = folder.strip().strip("/")
    if not normalized:
        return "uploads"
    if (
        "\\" in normalized
        or ".." in normalized
        or "//" in normalized
        or not CLOUDINARY_FOLDER_PATTERN.fullmatch(normalized)
    ):
        raise ValidationAppError(
            message="Invalid upload folder",
            errors=[
                ErrorDetail(
                    field="folder",
                    message="Folder names may contain only letters, numbers, '/', '_', and '-'",
                    code="invalid_folder",
                ),
            ],
        )
    return normalized
