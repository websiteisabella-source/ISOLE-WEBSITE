"""Category repository."""

from app.models.category import Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    """Repository for categories."""

    def __init__(self) -> None:
        super().__init__(Category)

    async def get_by_slug(self, slug: str) -> Category | None:
        """Find a category by slug."""

        return await self.find_one({"slug": slug})
