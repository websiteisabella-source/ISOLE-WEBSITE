"""Pagination dependencies."""

from fastapi import Query

from app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.schemas.base import PaginationParams


def get_pagination(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE),
) -> PaginationParams:
    """Return validated pagination parameters."""

    return PaginationParams(page=page, page_size=page_size)
