"""Product service."""

from app.exceptions.exceptions import NotFoundError, ValidationAppError
from app.repositories.categories import CategoryRepository
from app.repositories.images import ImageRepository
from app.repositories.products import ProductRepository
from app.schemas.base import ErrorDetail
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.object_id import serialize_document


class ProductService:
    """Product CRUD workflows."""

    def __init__(self) -> None:
        self.products = ProductRepository()
        self.categories = CategoryRepository()
        self.images = ImageRepository()

    async def create_product(self, payload: ProductCreate) -> dict:
        """Create a product after validating references."""

        await self._validate_references(payload.category_ids, payload.image_ids)
        product = await self.products.create(payload.model_dump())
        return serialize_document(product)

    async def list_products(
        self,
        skip: int,
        limit: int,
        category_id: str | None = None,
        featured: bool | None = None,
    ) -> tuple[list[dict], int]:
        """List products."""

        filters: dict[str, object] = {"is_active": True}
        if category_id:
            filters["category_ids"] = category_id
        if featured is not None:
            filters["is_featured"] = featured
        products = await self.products.list(skip=skip, limit=limit, filters=filters)
        total = await self.products.count(filters=filters)
        return [serialize_document(product) for product in products], total

    async def get_product(self, product_id: str) -> dict:
        """Get a product by id."""

        product = await self.products.get(product_id)
        return serialize_document(product)

    async def update_product(self, product_id: str, payload: ProductUpdate) -> dict:
        """Update a product after validating changed references."""

        update_data = payload.model_dump(exclude_unset=True)
        category_ids = update_data.get("category_ids")
        image_ids = update_data.get("image_ids")
        if category_ids is not None or image_ids is not None:
            await self._validate_references(
                category_ids if isinstance(category_ids, list) else [],
                image_ids if isinstance(image_ids, list) else [],
            )
        product = await self.products.update(product_id, update_data)
        return serialize_document(product)

    async def delete_product(self, product_id: str) -> dict:
        """Soft delete a product."""

        product = await self.products.soft_delete(product_id)
        return serialize_document(product)

    async def _validate_references(
        self,
        category_ids: list[str],
        image_ids: list[str],
    ) -> None:
        """Validate product references to categories and images."""

        missing: list[ErrorDetail] = []
        for category_id in category_ids:
            try:
                await self.categories.get(category_id)
            except NotFoundError:
                missing.append(
                    ErrorDetail(
                        field="category_ids",
                        message=f"Category does not exist: {category_id}",
                        code="missing_category",
                    )
                )
        for image_id in image_ids:
            try:
                await self.images.get(image_id)
            except NotFoundError:
                missing.append(
                    ErrorDetail(
                        field="image_ids",
                        message=f"Image does not exist: {image_id}",
                        code="missing_image",
                    ),
                )
        if missing:
            raise ValidationAppError(
                message="Invalid product references",
                errors=missing,
            )
