"""Product category model."""

from pydantic import Field
from pymongo import ASCENDING, IndexModel

from app.core.enums import CatalogGroupKind
from app.models.base import BaseDocument


class Category(BaseDocument):
    """Catalog category."""

    name: str = Field(min_length=1, max_length=120)
    slug: str = Field(min_length=1, max_length=140)
    description: str | None = Field(default=None, max_length=500)
    parent_id: str | None = None
    kind: CatalogGroupKind = CatalogGroupKind.CLOTHING_TYPE
    cover_image_id: str | None = None
    sort_order: int = 0
    created_by: str | None = None
    updated_by: str | None = None

    class Settings:
        """Beanie collection settings."""

        name = "categories"
        use_state_management = True
        indexes = [
            IndexModel([("slug", ASCENDING)], unique=True, name="uq_categories_slug"),
            IndexModel(
                [("kind", ASCENDING), ("is_active", ASCENDING)], name="idx_categories_kind_state"
            ),
            IndexModel([("sort_order", ASCENDING)], name="idx_categories_sort_order"),
            IndexModel([("parent_id", ASCENDING)], name="idx_categories_parent_id"),
            IndexModel([("deleted_at", ASCENDING)], name="idx_categories_deleted_at"),
        ]
