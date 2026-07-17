"""Category routes."""

from fastapi import APIRouter, Depends, Query, status

from app.api.v1.dependencies.auth import get_current_admin
from app.api.v1.dependencies.pagination import get_pagination
from app.core.enums import CatalogGroupKind
from app.core.responses import success_response
from app.models.user import User
from app.schemas.base import PaginationParams
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create category")
async def create_category(
    payload: CategoryCreate,
    admin: User = Depends(get_current_admin),
):
    """Create a category. Admin only."""

    data = await CategoryService().create_category(payload, admin_id=str(admin.id))
    return success_response(
        message="Category created successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.get("", summary="List categories")
async def list_categories(
    pagination: PaginationParams = Depends(get_pagination),
    kind: CatalogGroupKind | None = Query(default=None),
):
    """List active categories."""

    items, total = await CategoryService().list_categories(
        skip=pagination.skip,
        limit=pagination.page_size,
        kind=kind,
        active_only=True,
    )
    return success_response(
        message="Categories retrieved successfully",
        data={
            "items": items,
            "total": total,
            "page": pagination.page,
            "page_size": pagination.page_size,
        },
    )


@router.get("/{category_id}", summary="Get category")
async def get_category(category_id: str):
    """Get a category by id."""

    data = await CategoryService().get_category(category_id)
    return success_response(message="Category retrieved successfully", data=data)


@router.patch("/{category_id}", summary="Update category")
async def update_category(
    category_id: str,
    payload: CategoryUpdate,
    admin: User = Depends(get_current_admin),
):
    """Update a category. Admin only."""

    data = await CategoryService().update_category(
        category_id,
        payload,
        admin_id=str(admin.id),
    )
    return success_response(message="Category updated successfully", data=data)


@router.delete("/{category_id}", summary="Delete category")
async def delete_category(
    category_id: str,
    _: User = Depends(get_current_admin),
):
    """Soft delete a category. Admin only."""

    data = await CategoryService().delete_category(category_id)
    return success_response(message="Category deleted successfully", data=data)
