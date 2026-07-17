"""Cloudinary image storage service."""

import asyncio
from io import BytesIO
from typing import Any

import cloudinary.api
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from fastapi import UploadFile

import cloudinary as cloudinary_sdk
from app.config.settings import Settings, get_settings
from app.exceptions.exceptions import AppException, ValidationAppError
from app.schemas.base import ErrorDetail
from app.validators.image import validate_cloudinary_folder, validate_image_upload


def configure_cloudinary(settings: Settings) -> None:
    """Configure the Cloudinary SDK from environment settings."""

    if not (
        settings.cloudinary_cloud_name
        and settings.cloudinary_api_key
        and settings.cloudinary_api_secret.get_secret_value()
    ):
        return
    cloudinary_sdk.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret.get_secret_value(),
        secure=True,
    )


class CloudinaryService:
    """Async wrapper around the Cloudinary SDK."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def _ensure_configured(self) -> None:
        """Ensure Cloudinary credentials are present before remote calls."""

        if not (
            self.settings.cloudinary_cloud_name
            and self.settings.cloudinary_api_key
            and self.settings.cloudinary_api_secret.get_secret_value()
        ):
            raise AppException("Cloudinary is not configured", status_code=503)

    async def upload_image(
        self,
        file: UploadFile,
        folder: str = "uploads",
    ) -> dict[str, Any]:
        """Upload an image to Cloudinary and return normalized metadata."""

        self._ensure_configured()
        validate_image_upload(file, self.settings)
        folder = validate_cloudinary_folder(folder)
        file_bytes = await file.read()
        if len(file_bytes) > self.settings.max_upload_size_bytes:
            raise ValidationAppError(
                message="Image too large",
                errors=[
                    ErrorDetail(
                        field="file",
                        message=("Image size exceeds " f"{self.settings.max_upload_size_mb} MB"),
                        code="image_too_large",
                    ),
                ],
            )

        buffer = BytesIO(file_bytes)
        buffer.name = file.filename or "upload"
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            buffer,
            folder=folder,
            resource_type="image",
            use_filename=True,
            unique_filename=True,
            overwrite=False,
        )
        return self._normalize_upload_result(result, folder, file.filename)

    async def delete_image(self, public_id: str) -> dict[str, Any]:
        """Delete an image from Cloudinary."""

        self._ensure_configured()
        return await asyncio.to_thread(
            cloudinary.uploader.destroy,
            public_id,
            resource_type="image",
            invalidate=True,
        )

    async def replace_image(
        self,
        public_id: str,
        file: UploadFile,
    ) -> dict[str, Any]:
        """Replace an existing Cloudinary image while keeping its public id."""

        self._ensure_configured()
        validate_image_upload(file, self.settings)
        file_bytes = await file.read()
        if len(file_bytes) > self.settings.max_upload_size_bytes:
            raise ValidationAppError(
                message="Image too large",
                errors=[
                    ErrorDetail(
                        field="file",
                        message=("Image size exceeds " f"{self.settings.max_upload_size_mb} MB"),
                        code="image_too_large",
                    ),
                ],
            )

        buffer = BytesIO(file_bytes)
        buffer.name = file.filename or "replacement"
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            buffer,
            public_id=public_id,
            resource_type="image",
            overwrite=True,
            invalidate=True,
        )
        folder = public_id.rsplit("/", maxsplit=1)[0] if "/" in public_id else ""
        return self._normalize_upload_result(result, folder, file.filename)

    async def get_image(self, public_id: str) -> dict[str, Any]:
        """Fetch Cloudinary metadata for an image."""

        self._ensure_configured()
        return await asyncio.to_thread(
            cloudinary.api.resource,
            public_id,
            resource_type="image",
        )

    async def generate_signed_url(
        self,
        public_id: str,
        expires_at: int | None = None,
    ) -> str:
        """Generate a signed Cloudinary delivery URL."""

        self._ensure_configured()
        url, _ = await asyncio.to_thread(
            cloudinary_url,
            public_id,
            resource_type="image",
            sign_url=True,
            expires_at=expires_at,
            secure=True,
        )
        return url

    def _normalize_upload_result(
        self,
        result: dict[str, Any],
        folder: str,
        original_filename: str | None,
    ) -> dict[str, Any]:
        """Normalize Cloudinary's response to the MongoDB image schema."""

        return {
            "public_id": result["public_id"],
            "asset_id": result["asset_id"],
            "secure_url": result["secure_url"],
            "format": result.get("format", ""),
            "width": result.get("width", 0),
            "height": result.get("height", 0),
            "bytes": result.get("bytes", 0),
            "folder": folder,
            "resource_type": result.get("resource_type", "image"),
            "original_filename": original_filename,
        }
