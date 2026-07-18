"""Product service."""

import re

from pymongo import ASCENDING, DESCENDING

from app.core.enums import ProductStatus
from app.exceptions.exceptions import NotFoundError, ValidationAppError
from app.repositories.categories import CategoryRepository
from app.repositories.images import ImageRepository
from app.repositories.products import ProductRepository
from app.schemas.base import ErrorDetail
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.object_id import serialize_document

SORT_FIELDS = {
    "name": "name",
    "updated_at": "updated_at",
    "price": "price",
    "sort_order": "sort_order",
}


class ProductService:
    """Product CRUD workflows."""

    def __init__(self) -> None:
        self.products = ProductRepository()
        self.categories = CategoryRepository()
        self.images = ImageRepository()

    async def create_product(
        self,
        payload: ProductCreate,
        admin_id: str | None = None,
    ) -> dict:
        """Create a product after validating references and publishability."""

        data = payload.model_dump()
        await self._validate_references(data)
        data["created_by"] = admin_id
        data["updated_by"] = admin_id
        data["publication_errors"] = self.publication_errors(data)
        if data["status"] == ProductStatus.PUBLISHED and data["publication_errors"]:
            raise ValidationAppError(
                message="Product cannot be published",
                errors=[
                    ErrorDetail(field="status", message=error, code="missing_required")
                    for error in data["publication_errors"]
                ],
            )
        product = await self.products.create(data)
        return serialize_document(product)

    async def list_products(
        self,
        skip: int,
        limit: int,
        category_id: str | None = None,
        featured: bool | None = None,
    ) -> tuple[list[dict], int]:
        """List public published products."""

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
        products = await self.products.list_public(
            skip=skip,
            limit=limit,
            category_id=category_id,
            featured=featured,
        )
        total = await self.products.count(filters=filters)
        return [serialize_document(product) for product in products], total

    async def list_admin_products(
        self,
        skip: int,
        limit: int,
        search: str | None = None,
        status: ProductStatus | None = None,
        collection_id: str | None = None,
        clothing_type_id: str | None = None,
        sort: str = "updated_at",
        direction: str = "desc",
    ) -> tuple[list[dict], int]:
        """List products for the admin panel."""

        filters = self._admin_filters(
            search=search,
            status=status,
            collection_id=collection_id,
            clothing_type_id=clothing_type_id,
        )
        sort_field = SORT_FIELDS.get(sort, "updated_at")
        sort_direction = ASCENDING if direction == "asc" else DESCENDING
        products = await self.products.list_admin(
            skip=skip,
            limit=limit,
            filters=filters,
            sort_field=sort_field,
            sort_direction=sort_direction,
        )
        total = await self.products.count(filters=filters)
        return [serialize_document(product) for product in products], total

    async def get_product(self, product_id: str) -> dict:
        """Get a product by id."""

        product = await self.products.get(product_id)
        return serialize_document(product)

    async def get_public_product(self, product_id: str) -> dict:
        """Get a public product by id."""

        product = await self.products.get(product_id)
        if not product.is_active or product.status != ProductStatus.PUBLISHED:
            raise NotFoundError("Product not found")
        return serialize_document(product)

    async def get_public_product_by_slug(self, slug: str) -> dict:
        """Get a public product by slug."""

        product = await self.products.get_by_slug(slug)
        if product is None or not product.is_active or product.status != ProductStatus.PUBLISHED:
            raise NotFoundError("Product not found")
        return serialize_document(product)

    async def update_product(
        self,
        product_id: str,
        payload: ProductUpdate,
        admin_id: str | None = None,
    ) -> dict:
        """Update a product after validating changed references."""

        update_data = payload.model_dump(exclude_unset=True)
        current = await self.products.get(product_id)
        merged = serialize_document(current)
        merged.update(update_data)
        await self._validate_references(merged)
        merged_errors = self.publication_errors(merged)
        if update_data.get("status") == ProductStatus.PUBLISHED and merged_errors:
            raise ValidationAppError(
                message="Product cannot be published",
                errors=[
                    ErrorDetail(field="status", message=error, code="missing_required")
                    for error in merged_errors
                ],
            )
        update_data["publication_errors"] = merged_errors
        update_data["updated_by"] = admin_id
        product = await self.products.update(product_id, update_data)
        return serialize_document(product)

    async def publish_product(self, product_id: str, admin_id: str | None = None) -> dict:
        """Publish a product when it has the minimum public data."""

        product = await self.products.get(product_id)
        data = serialize_document(product)
        errors = self.publication_errors(data)
        if errors:
            raise ValidationAppError(
                message="Product cannot be published",
                errors=[
                    ErrorDetail(field="status", message=error, code="missing_required")
                    for error in errors
                ],
            )
        return await self.update_product(
            product_id,
            ProductUpdate(status=ProductStatus.PUBLISHED, is_active=True),
            admin_id=admin_id,
        )

    async def archive_product(self, product_id: str, admin_id: str | None = None) -> dict:
        """Archive a product without deleting its data."""

        return await self.update_product(
            product_id,
            ProductUpdate(status=ProductStatus.ARCHIVED, is_active=False),
            admin_id=admin_id,
        )

    async def duplicate_product(
        self,
        product_id: str,
        admin_id: str | None = None,
    ) -> dict:
        """Duplicate a product as a draft with a unique slug suffix."""

        source = await self.products.get(product_id)
        source_data = serialize_document(source)
        source_data.pop("id", None)
        source_data.pop("created_at", None)
        source_data.pop("updated_at", None)
        source_data.pop("deleted_at", None)
        source_data["name"] = f"{source.name} copia"
        source_data["slug"] = await self._unique_slug(f"{source.slug}-copia")
        source_data["status"] = ProductStatus.DRAFT
        source_data["is_active"] = True
        source_data["is_featured"] = False
        source_data["created_by"] = admin_id
        source_data["updated_by"] = admin_id
        source_data["publication_errors"] = self.publication_errors(source_data)
        product = await self.products.create(source_data)
        return serialize_document(product)

    async def delete_product(self, product_id: str) -> dict:
        """Soft delete a product."""

        product = await self.products.soft_delete(product_id)
        return serialize_document(product)

    async def summary(self) -> dict:
        """Return admin dashboard product metrics."""

        base = {"deleted_at": None}
        total = await self.products.count(filters=base)
        published = await self.products.count(
            filters={**base, "status": ProductStatus.PUBLISHED, "is_active": True},
        )
        draft = await self.products.count(filters={**base, "status": ProductStatus.DRAFT})
        archived = await self.products.count(filters={**base, "status": ProductStatus.ARCHIVED})
        recent = await self.products.list_admin(skip=0, limit=5)
        incomplete_count = 0
        checked = await self.products.list_admin(skip=0, limit=100)
        for product in checked:
            if self.publication_errors(serialize_document(product)):
                incomplete_count += 1
        return {
            "total_products": total,
            "published_products": published,
            "draft_products": draft,
            "archived_products": archived,
            "incomplete_products": incomplete_count,
            "recent_products": [serialize_document(product) for product in recent],
        }

    def publication_errors(self, data: dict) -> list[str]:
        """Return missing fields that block publication."""

        errors: list[str] = []
        if not data.get("name"):
            errors.append("Falta el nombre.")
        if not data.get("slug"):
            errors.append("Falta el slug.")
        if not data.get("description") and not data.get("short_description"):
            errors.append("Falta una descripción.")
        if not data.get("image_ids") and not data.get("primary_image_id"):
            errors.append("Falta al menos una imagen.")
        if not data.get("collection_ids") and not data.get("clothing_type_ids"):
            errors.append("Falta una colección o tipo de ropa.")
        return errors

    async def _validate_references(self, data: dict) -> None:
        """Validate product references to categories and images."""

        category_ids = set(data.get("category_ids") or [])
        category_ids.update(data.get("collection_ids") or [])
        category_ids.update(data.get("clothing_type_ids") or [])
        image_ids = set(data.get("image_ids") or [])
        if data.get("primary_image_id"):
            image_ids.add(data["primary_image_id"])

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

    def _admin_filters(
        self,
        search: str | None,
        status: ProductStatus | None,
        collection_id: str | None,
        clothing_type_id: str | None,
    ) -> dict[str, object]:
        """Build safe admin product filters."""

        filters: dict[str, object] = {}
        if search:
            search_pattern = re.escape(search.strip())
            filters["$or"] = [
                {"name": {"$regex": search_pattern, "$options": "i"}},
                {"slug": {"$regex": search_pattern, "$options": "i"}},
                {"sku": {"$regex": search_pattern, "$options": "i"}},
            ]
        if status:
            filters["status"] = status
        if collection_id:
            filters["collection_ids"] = collection_id
        if clothing_type_id:
            filters["clothing_type_ids"] = clothing_type_id
        return filters

    async def _unique_slug(self, base_slug: str) -> str:
        """Return a unique copy slug."""

        candidate = base_slug
        suffix = 2
        while await self.products.get_by_slug(candidate):
            candidate = f"{base_slug}-{suffix}"
            suffix += 1
        return candidate
