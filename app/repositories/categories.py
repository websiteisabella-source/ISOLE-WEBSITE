"""Category repository."""

from pymongo import ASCENDING

from app.core.enums import CatalogGroupKind
from app.models.category import Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    """Repository for categories."""

    def __init__(self) -> None:
        super().__init__(Category)

    async def get_by_slug(self, slug: str) -> Category | None:
        """Find a category by slug."""

        return await self.find_one({"slug": slug})

    async def list_by_kind(
        self,
        kind: CatalogGroupKind | None = None,
        active_only: bool = False,
    ) -> list[Category]:
        """List categories or collections ordered for catalog display."""

        filters: dict[str, object] = {}
        if kind is not None:
            filters["kind"] = kind
        if active_only:
            filters["is_active"] = True
        query = self._base_query()
        query.update(filters)
        return await self.model.find(query).sort(("sort_order", ASCENDING), ("name", ASCENDING)).to_list()
