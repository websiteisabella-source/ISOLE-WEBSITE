"""Image schemas."""

from pydantic import BaseModel, Field

from app.core.enums import ResourceType
from app.schemas.base import TimestampedRead


class ImageRead(TimestampedRead):
    """Cloudinary image metadata."""

    public_id: str
    asset_id: str
    secure_url: str
    format: str
    width: int
    height: int
    bytes: int
    folder: str
    resource_type: ResourceType
    original_filename: str | None = None
    uploaded_by: str | None = None


class ImageUpdate(BaseModel):
    """Editable image metadata."""

    folder: str | None = Field(default=None, min_length=1, max_length=120)


class SignedUrlRead(BaseModel):
    """Signed Cloudinary delivery URL."""

    url: str
