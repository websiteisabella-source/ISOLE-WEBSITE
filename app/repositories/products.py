"""Product repository."""

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

        filters: dict[str, object] = {"is_active": True}
        if category_id:
            filters["category_ids"] = category_id
        if featured is not None:
            filters["is_featured"] = featured
        return await self.list(skip=skip, limit=limit, filters=filters)
