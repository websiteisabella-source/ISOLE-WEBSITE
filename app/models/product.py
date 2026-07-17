"""Product model."""

from typing import Any

from pydantic import Field
from pymongo import ASCENDING, IndexModel

from app.models.base import BaseDocument


class Product(BaseDocument):
    """Catalog product."""

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

    class Settings:
        """Beanie collection settings."""

        name = "products"
        use_state_management = True
        indexes = [
            IndexModel([("slug", ASCENDING)], unique=True, name="uq_products_slug"),
            IndexModel([("sku", ASCENDING)], unique=True, sparse=True, name="uq_products_sku"),
            IndexModel([("category_ids", ASCENDING)], name="idx_products_category_ids"),
            IndexModel([("is_featured", ASCENDING)], name="idx_products_is_featured"),
            IndexModel([("deleted_at", ASCENDING)], name="idx_products_deleted_at"),
        ]
