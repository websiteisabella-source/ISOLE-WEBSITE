"""Product routes."""

from fastapi import APIRouter, Depends, Query, status

from app.api.v1.dependencies.auth import get_current_admin
from app.api.v1.dependencies.pagination import get_pagination
from app.core.responses import success_response
from app.models.user import User
from app.schemas.base import PaginationParams
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create product")
async def create_product(
    payload: ProductCreate,
    _: User = Depends(get_current_admin),
):
    """Create a product. Admin only."""

    data = await ProductService().create_product(payload)
    return success_response(
        message="Product created successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.get("", summary="List products")
async def list_products(
    pagination: PaginationParams = Depends(get_pagination),
    category_id: str | None = Query(default=None),
    featured: bool | None = Query(default=None),
):
    """List active products."""

    items, total = await ProductService().list_products(
        skip=pagination.skip,
        limit=pagination.page_size,
        category_id=category_id,
        featured=featured,
    )
    return success_response(
        message="Products retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.get("/{product_id}", summary="Get product")
async def get_product(product_id: str):
    """Get a product by id."""

    data = await ProductService().get_product(product_id)
    return success_response(message="Product retrieved successfully", data=data)


@router.patch("/{product_id}", summary="Update product")
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    _: User = Depends(get_current_admin),
):
    """Update a product. Admin only."""

    data = await ProductService().update_product(product_id, payload)
    return success_response(message="Product updated successfully", data=data)


@router.delete("/{product_id}", summary="Delete product")
async def delete_product(
    product_id: str,
    _: User = Depends(get_current_admin),
):
    """Soft delete a product. Admin only."""

    data = await ProductService().delete_product(product_id)
    return success_response(message="Product deleted successfully", data=data)
