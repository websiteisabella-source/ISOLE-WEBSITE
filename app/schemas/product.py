"""Product schemas."""

from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator

from app.core.enums import ProductStatus
from app.schemas.base import TimestampedRead
from app.validators.common import validate_slug
from app.validators.security import reject_nosql_injection, sanitize_text


class ProductVariantPayload(BaseModel):
    """Editable product variant."""

    color: str | None = Field(default=None, max_length=80)
    size: str | None = Field(default=None, max_length=40)
    sku: str | None = Field(default=None, max_length=80)
    stock: int | None = Field(default=None, ge=0)
    price: float | None = Field(default=None, ge=0)
    is_active: bool = True

    @field_validator("color", "size", "sku")
    @classmethod
    def sanitize_variant_strings(cls, value: str | None) -> str | None:
        """Sanitize variant text."""

        return sanitize_text(value) if value else value


class ProductCreate(BaseModel):
    """Payload to create a product."""

    name: str = Field(min_length=1, max_length=180)
    slug: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=4000)
    short_description: str | None = Field(default=None, max_length=500)
    price: float | None = Field(default=None, ge=0)
    compare_at_price: float | None = Field(default=None, ge=0)
    currency: str = Field(default="COP", min_length=3, max_length=3)
    sku: str | None = Field(default=None, max_length=80)
    stock: int | None = Field(default=None, ge=0)
    status: ProductStatus = ProductStatus.DRAFT
    category_ids: list[str] = Field(default_factory=list)
    collection_ids: list[str] = Field(default_factory=list)
    clothing_type_ids: list[str] = Field(default_factory=list)
    image_ids: list[str] = Field(default_factory=list)
    primary_image_id: str | None = None
    variants: list[ProductVariantPayload] = Field(default_factory=list)
    attributes: dict[str, Any] = Field(default_factory=dict)
    is_featured: bool = False
    sort_order: int = 0

    @field_validator("name", "description", "short_description", "sku")
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

    @model_validator(mode="after")
    def validate_primary_image(self) -> "ProductCreate":
        """Ensure primary image belongs to the product image list."""

        if self.primary_image_id and self.primary_image_id not in self.image_ids:
            self.image_ids.append(self.primary_image_id)
        return self


class ProductUpdate(BaseModel):
    """Payload to update a product."""

    name: str | None = Field(default=None, min_length=1, max_length=180)
    slug: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=4000)
    short_description: str | None = Field(default=None, max_length=500)
    price: float | None = Field(default=None, ge=0)
    compare_at_price: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    sku: str | None = Field(default=None, max_length=80)
    stock: int | None = Field(default=None, ge=0)
    status: ProductStatus | None = None
    category_ids: list[str] | None = None
    collection_ids: list[str] | None = None
    clothing_type_ids: list[str] | None = None
    image_ids: list[str] | None = None
    primary_image_id: str | None = None
    variants: list[ProductVariantPayload] | None = None
    attributes: dict[str, Any] | None = None
    is_featured: bool | None = None
    sort_order: int | None = None
    is_active: bool | None = None

    @field_validator("name", "description", "short_description", "sku")
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
    description: str | None = None
    short_description: str | None = None
    price: float | None = None
    compare_at_price: float | None = None
    currency: str
    sku: str | None = None
    stock: int | None = None
    status: ProductStatus
    publication_errors: list[str]
    category_ids: list[str]
    collection_ids: list[str]
    clothing_type_ids: list[str]
    image_ids: list[str]
    primary_image_id: str | None = None
    variants: list[ProductVariantPayload]
    attributes: dict[str, Any]
    is_featured: bool
    sort_order: int
    created_by: str | None = None
    updated_by: str | None = None
