"""Category schemas."""

from pydantic import BaseModel, Field, field_validator

from app.schemas.base import TimestampedRead
from app.validators.common import validate_slug
from app.validators.security import sanitize_text


class CategoryCreate(BaseModel):
    """Payload to create a category."""

    name: str = Field(min_length=1, max_length=120)
    slug: str = Field(min_length=1, max_length=140)
    description: str | None = Field(default=None, max_length=500)
    parent_id: str | None = None

    @field_validator("name", "description")
    @classmethod
    def sanitize_strings(cls, value: str | None) -> str | None:
        """Sanitize category strings."""

        return sanitize_text(value) if value else value

    @field_validator("slug")
    @classmethod
    def validate_category_slug(cls, value: str) -> str:
        """Validate category slug format."""

        return validate_slug(value)


class CategoryUpdate(BaseModel):
    """Payload to update a category."""

    name: str | None = Field(default=None, min_length=1, max_length=120)
    slug: str | None = Field(default=None, min_length=1, max_length=140)
    description: str | None = Field(default=None, max_length=500)
    parent_id: str | None = None
    is_active: bool | None = None

    @field_validator("name", "description")
    @classmethod
    def sanitize_strings(cls, value: str | None) -> str | None:
        """Sanitize category strings."""

        return sanitize_text(value) if value else value

    @field_validator("slug")
    @classmethod
    def validate_category_slug(cls, value: str | None) -> str | None:
        """Validate category slug format."""

        return validate_slug(value) if value else value


class CategoryRead(TimestampedRead):
    """Category response."""

    name: str
    slug: str
    description: str | None = None
    parent_id: str | None = None
