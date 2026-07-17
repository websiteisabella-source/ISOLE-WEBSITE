"""Category service."""

from app.core.enums import CatalogGroupKind
from app.repositories.categories import CategoryRepository
from app.repositories.products import ProductRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.utils.object_id import serialize_document


class CategoryService:
    """Category and collection CRUD workflows."""

    def __init__(self) -> None:
        self.categories = CategoryRepository()
        self.products = ProductRepository()

    async def create_category(
        self,
        payload: CategoryCreate,
        admin_id: str | None = None,
    ) -> dict:
        """Create a category or collection."""

        data = payload.model_dump()
        data["created_by"] = admin_id
        data["updated_by"] = admin_id
        category = await self.categories.create(data)
        return serialize_document(category)

    async def list_categories(
        self,
        skip: int,
        limit: int,
        kind: CatalogGroupKind | None = None,
        active_only: bool = False,
    ) -> tuple[list[dict], int]:
        """List categories."""

        filters: dict[str, object] = {}
        if kind is not None:
            filters["kind"] = kind
        if active_only:
            filters["is_active"] = True
        categories = await self.categories.list(skip=skip, limit=limit, filters=filters)
        total = await self.categories.count(filters=filters)
        return [serialize_document(category) for category in categories], total

    async def list_catalog_groups(self, kind: CatalogGroupKind | None = None) -> list[dict]:
        """List active catalog groups for public catalog navigation."""

        categories = await self.categories.list_by_kind(kind=kind, active_only=True)
        return [serialize_document(category) for category in categories]

    async def get_category(self, category_id: str) -> dict:
        """Get a category by id."""

        category = await self.categories.get(category_id)
        return serialize_document(category)

    async def update_category(
        self,
        category_id: str,
        payload: CategoryUpdate,
        admin_id: str | None = None,
    ) -> dict:
        """Update a category."""

        data = payload.model_dump(exclude_unset=True)
        data["updated_by"] = admin_id
        category = await self.categories.update(category_id, data)
        return serialize_document(category)

    async def delete_category(self, category_id: str) -> dict:
        """Soft delete a category without deleting related products."""

        category = await self.categories.soft_delete(category_id)
        return serialize_document(category)

    async def product_count(self, category_id: str) -> int:
        """Count products related to a category or collection."""

        return await self.products.count(
            filters={
                "$or": [
                    {"category_ids": category_id},
                    {"collection_ids": category_id},
                    {"clothing_type_ids": category_id},
                ]
            }
        )
