"""Product model."""

from typing import Any

from pydantic import BaseModel, Field
from pymongo import ASCENDING, IndexModel

from app.core.enums import ProductStatus
from app.models.base import BaseDocument


class ProductVariant(BaseModel):
    """Product variant stored inline with the catalog product."""

    color: str | None = Field(default=None, max_length=80)
    size: str | None = Field(default=None, max_length=40)
    sku: str | None = Field(default=None, max_length=80)
    stock: int | None = Field(default=None, ge=0)
    price: float | None = Field(default=None, ge=0)
    is_active: bool = True


class Product(BaseDocument):
    """Catalog product."""

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
    publication_errors: list[str] = Field(default_factory=list)
    category_ids: list[str] = Field(default_factory=list)
    collection_ids: list[str] = Field(default_factory=list)
    clothing_type_ids: list[str] = Field(default_factory=list)
    image_ids: list[str] = Field(default_factory=list)
    primary_image_id: str | None = None
    variants: list[ProductVariant] = Field(default_factory=list)
    attributes: dict[str, Any] = Field(default_factory=dict)
    is_featured: bool = False
    sort_order: int = 0
    created_by: str | None = None
    updated_by: str | None = None

    class Settings:
        """Beanie collection settings."""

        name = "products"
        use_state_management = True
        indexes = [
            IndexModel([("slug", ASCENDING)], unique=True, name="uq_products_slug"),
            IndexModel([("sku", ASCENDING)], unique=True, sparse=True, name="uq_products_sku"),
            IndexModel([("category_ids", ASCENDING)], name="idx_products_category_ids"),
            IndexModel([("collection_ids", ASCENDING)], name="idx_products_collection_ids"),
            IndexModel([("clothing_type_ids", ASCENDING)], name="idx_products_clothing_type_ids"),
            IndexModel([("status", ASCENDING), ("is_active", ASCENDING)], name="idx_products_public_state"),
            IndexModel([("sort_order", ASCENDING)], name="idx_products_sort_order"),
            IndexModel([("is_featured", ASCENDING)], name="idx_products_is_featured"),
            IndexModel([("deleted_at", ASCENDING)], name="idx_products_deleted_at"),
        ]
