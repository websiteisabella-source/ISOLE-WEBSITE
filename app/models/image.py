"""Cloudinary image asset model."""

from pymongo import ASCENDING, IndexModel

from app.core.enums import ResourceType
from app.models.base import BaseDocument


class ImageAsset(BaseDocument):
    """Image metadata stored after a Cloudinary upload."""

    public_id: str
    asset_id: str
    secure_url: str
    format: str
    width: int
    height: int
    bytes: int
    folder: str
    resource_type: ResourceType = ResourceType.IMAGE
    original_filename: str | None = None
    uploaded_by: str | None = None

    class Settings:
        """Beanie collection settings."""

        name = "image_assets"
        use_state_management = True
        indexes = [
            IndexModel([("public_id", ASCENDING)], unique=True, name="uq_images_public_id"),
            IndexModel([("asset_id", ASCENDING)], name="idx_images_asset_id"),
            IndexModel([("folder", ASCENDING)], name="idx_images_folder"),
            IndexModel([("deleted_at", ASCENDING)], name="idx_images_deleted_at"),
        ]
