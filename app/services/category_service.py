"""Category service."""

from app.repositories.categories import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.utils.object_id import serialize_document


class CategoryService:
    """Category CRUD workflows."""

    def __init__(self) -> None:
        self.categories = CategoryRepository()

    async def create_category(self, payload: CategoryCreate) -> dict:
        """Create a category."""

        category = await self.categories.create(payload.model_dump())
        return serialize_document(category)

    async def list_categories(self, skip: int, limit: int) -> tuple[list[dict], int]:
        """List categories."""

        categories = await self.categories.list(skip=skip, limit=limit)
        total = await self.categories.count()
        return [serialize_document(category) for category in categories], total

    async def get_category(self, category_id: str) -> dict:
        """Get a category by id."""

        category = await self.categories.get(category_id)
        return serialize_document(category)

    async def update_category(self, category_id: str, payload: CategoryUpdate) -> dict:
        """Update a category."""

        category = await self.categories.update(
            category_id,
            payload.model_dump(exclude_unset=True),
        )
        return serialize_document(category)

    async def delete_category(self, category_id: str) -> dict:
        """Soft delete a category."""

        category = await self.categories.soft_delete(category_id)
        return serialize_document(category)
