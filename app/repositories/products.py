"""Product repository."""

from typing import Any

from pymongo import ASCENDING, DESCENDING

from app.core.enums import ProductStatus
from app.models.product import Product
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    """Repository for products."""

    def __init__(self) -> None:
        super().__init__(Product)

    async def get_by_slug(self, slug: str) -> Product | None:
        """Find a product by slug."""

        return await self.find_one({"slug": slug})

    async def list_public(
        self,
        skip: int = 0,
        limit: int = 20,
        category_id: str | None = None,
        featured: bool | None = None,
    ) -> list[Product]:
        """List active public products."""

        filters: dict[str, object] = {
            "is_active": True,
            "status": ProductStatus.PUBLISHED,
        }
        if category_id:
            filters["$or"] = [
                {"category_ids": category_id},
                {"collection_ids": category_id},
                {"clothing_type_ids": category_id},
            ]
        if featured is not None:
            filters["is_featured"] = featured
        query = self._base_query()
        query.update(filters)
        return await (
            self.model.find(query)
            .sort((Product.sort_order, ASCENDING), (Product.updated_at, DESCENDING))
            .skip(skip)
            .limit(limit)
            .to_list()
        )

    async def list_admin(
        self,
        skip: int = 0,
        limit: int = 20,
        filters: dict[str, Any] | None = None,
        sort_field: str = "updated_at",
        sort_direction: int = DESCENDING,
    ) -> list[Product]:
        """List products for admin workflows."""

        query = self._base_query()
        if filters:
            query.update(filters)
        return await (
            self.model.find(query)
            .sort((sort_field, sort_direction))
            .skip(skip)
            .limit(limit)
            .to_list()
        )
