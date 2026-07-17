"""Administrative catalog routes."""

from fastapi import APIRouter, Depends, Query, status

from app.api.v1.dependencies.auth import get_current_admin
from app.api.v1.dependencies.pagination import get_pagination
from app.core.enums import CatalogGroupKind, ProductStatus
from app.core.responses import success_response
from app.models.user import User
from app.schemas.base import PaginationParams
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.category_service import CategoryService
from app.services.product_service import ProductService

router = APIRouter(prefix="/admin/catalog", tags=["admin-catalog"])


@router.get("/summary", summary="Catalog admin summary")
async def summary(_: User = Depends(get_current_admin)):
    """Return real catalog summary metrics."""

    product_summary = await ProductService().summary()
    category_service = CategoryService()
    collections, total_collections = await category_service.list_categories(
        skip=0,
        limit=100,
        kind=CatalogGroupKind.COLLECTION,
    )
    clothing_types, total_clothing_types = await category_service.list_categories(
        skip=0,
        limit=100,
        kind=CatalogGroupKind.CLOTHING_TYPE,
    )
    return success_response(
        message="Catalog summary retrieved successfully",
        data={
            **product_summary,
            "total_collections": total_collections,
            "total_clothing_types": total_clothing_types,
            "collections": collections,
            "clothing_types": clothing_types,
        },
    )


@router.get("/products", summary="List admin products")
async def list_products(
    pagination: PaginationParams = Depends(get_pagination),
    search: str | None = Query(default=None, max_length=120),
    status_filter: ProductStatus | None = Query(default=None, alias="status"),
    collection_id: str | None = Query(default=None),
    clothing_type_id: str | None = Query(default=None),
    sort: str = Query(default="updated_at"),
    direction: str = Query(default="desc", pattern="^(asc|desc)$"),
    _: User = Depends(get_current_admin),
):
    """List products with admin filters."""

    items, total = await ProductService().list_admin_products(
        skip=pagination.skip,
        limit=pagination.page_size,
        search=search,
        status=status_filter,
        collection_id=collection_id,
        clothing_type_id=clothing_type_id,
        sort=sort,
        direction=direction,
    )
    return success_response(
        message="Admin products retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.post("/products", status_code=status.HTTP_201_CREATED, summary="Create admin product")
async def create_product(
    payload: ProductCreate,
    admin: User = Depends(get_current_admin),
):
    """Create a product as an administrator."""

    data = await ProductService().create_product(payload, admin_id=str(admin.id))
    return success_response(
        message="Product created successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.get("/products/{product_id}", summary="Get admin product")
async def get_product(
    product_id: str,
    _: User = Depends(get_current_admin),
):
    """Get a product for editing."""

    data = await ProductService().get_product(product_id)
    return success_response(message="Product retrieved successfully", data=data)


@router.patch("/products/{product_id}", summary="Update admin product")
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    admin: User = Depends(get_current_admin),
):
    """Update a product as an administrator."""

    data = await ProductService().update_product(
        product_id,
        payload,
        admin_id=str(admin.id),
    )
    return success_response(message="Product updated successfully", data=data)


@router.post("/products/{product_id}/publish", summary="Publish product")
async def publish_product(
    product_id: str,
    admin: User = Depends(get_current_admin),
):
    """Publish a complete product."""

    data = await ProductService().publish_product(product_id, admin_id=str(admin.id))
    return success_response(message="Product published successfully", data=data)


@router.post("/products/{product_id}/archive", summary="Archive product")
async def archive_product(
    product_id: str,
    admin: User = Depends(get_current_admin),
):
    """Archive a product."""

    data = await ProductService().archive_product(product_id, admin_id=str(admin.id))
    return success_response(message="Product archived successfully", data=data)


@router.post("/products/{product_id}/duplicate", summary="Duplicate product")
async def duplicate_product(
    product_id: str,
    admin: User = Depends(get_current_admin),
):
    """Duplicate a product as draft."""

    data = await ProductService().duplicate_product(product_id, admin_id=str(admin.id))
    return success_response(message="Product duplicated successfully", data=data)


@router.delete("/products/{product_id}", summary="Delete product")
async def delete_product(
    product_id: str,
    _: User = Depends(get_current_admin),
):
    """Soft-delete a product."""

    data = await ProductService().delete_product(product_id)
    return success_response(message="Product deleted successfully", data=data)


@router.get("/groups", summary="List admin catalog groups")
async def list_groups(
    pagination: PaginationParams = Depends(get_pagination),
    kind: CatalogGroupKind | None = Query(default=None),
    _: User = Depends(get_current_admin),
):
    """List collections and clothing types."""

    items, total = await CategoryService().list_categories(
        skip=pagination.skip,
        limit=pagination.page_size,
        kind=kind,
    )
    return success_response(
        message="Catalog groups retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.post("/groups", status_code=status.HTTP_201_CREATED, summary="Create catalog group")
async def create_group(
    payload: CategoryCreate,
    admin: User = Depends(get_current_admin),
):
    """Create a collection or clothing type."""

    data = await CategoryService().create_category(payload, admin_id=str(admin.id))
    return success_response(
        message="Catalog group created successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.patch("/groups/{group_id}", summary="Update catalog group")
async def update_group(
    group_id: str,
    payload: CategoryUpdate,
    admin: User = Depends(get_current_admin),
):
    """Update a collection or clothing type."""

    data = await CategoryService().update_category(
        group_id,
        payload,
        admin_id=str(admin.id),
    )
    return success_response(message="Catalog group updated successfully", data=data)


@router.delete("/groups/{group_id}", summary="Delete catalog group")
async def delete_group(
    group_id: str,
    _: User = Depends(get_current_admin),
):
    """Soft-delete a group without deleting products."""

    related_count = await CategoryService().product_count(group_id)
    data = await CategoryService().delete_category(group_id)
    return success_response(
        message="Catalog group deleted successfully",
        data={"group": data, "related_products": related_count},
    )
