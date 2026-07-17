"""Product schemas."""

from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.schemas.base import TimestampedRead
from app.validators.common import validate_slug
from app.validators.security import reject_nosql_injection, sanitize_text


class ProductCreate(BaseModel):
    """Payload to create a product."""

    name: str = Field(min_length=1, max_length=180)
    slug: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=4000)
    price: float = Field(ge=0)
    currency: str = Field(default="COP", min_length=3, max_length=3)
    sku: str | None = Field(default=None, max_length=80)
    stock: int = Field(default=0, ge=0)
    category_ids: list[str] = Field(default_factory=list)
    image_ids: list[str] = Field(default_factory=list)
    attributes: dict[str, Any] = Field(default_factory=dict)
    is_featured: bool = False

    @field_validator("name", "description", "sku")
    @classmethod
    def sanitize_strings(cls, value: str | None) -> str | None:
        """Sanitize product text fields."""

        return sanitize_text(value) if value else value

    @field_validator("slug")
    @classmethod
    def validate_product_slug(cls, value: str) -> str:
        """Validate product slug format."""

        return validate_slug(value)

    @field_validator("attributes")
    @classmethod
    def validate_attributes(cls, value: dict[str, Any]) -> dict[str, Any]:
        """Reject query operators in attributes."""

        reject_nosql_injection(value, "attributes")
        return value


class ProductUpdate(BaseModel):
    """Payload to update a product."""

    name: str | None = Field(default=None, min_length=1, max_length=180)
    slug: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1, max_length=4000)
    price: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    sku: str | None = Field(default=None, max_length=80)
    stock: int | None = Field(default=None, ge=0)
    category_ids: list[str] | None = None
    image_ids: list[str] | None = None
    attributes: dict[str, Any] | None = None
    is_featured: bool | None = None
    is_active: bool | None = None

    @field_validator("name", "description", "sku")
    @classmethod
    def sanitize_strings(cls, value: str | None) -> str | None:
        """Sanitize product text fields."""

        return sanitize_text(value) if value else value

    @field_validator("slug")
    @classmethod
    def validate_product_slug(cls, value: str | None) -> str | None:
        """Validate product slug format."""

        return validate_slug(value) if value else value

    @field_validator("attributes")
    @classmethod
    def validate_attributes(cls, value: dict[str, Any] | None) -> dict[str, Any] | None:
        """Reject query operators in attributes."""

        if value is not None:
            reject_nosql_injection(value, "attributes")
        return value


class ProductRead(TimestampedRead):
    """Product response."""

    name: str
    slug: str
    description: str
    price: float
    currency: str
    sku: str | None = None
    stock: int
    category_ids: list[str]
    image_ids: list[str]
    attributes: dict[str, Any]
    is_featured: bool
