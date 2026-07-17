"""Shared API response schemas."""

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    """Serializable validation or application error."""

    field: str | None = None
    message: str
    code: str | None = None


class ApiResponse(BaseModel, Generic[T]):
    """Standard API envelope returned by every endpoint."""

    success: bool
    message: str
    data: T | None = None
    errors: list[ErrorDetail] | None = None


class TimestampedRead(BaseModel):
    """Common read fields for MongoDB documents."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None
    is_active: bool = True


class PaginationParams(BaseModel):
    """Validated pagination request parameters."""

    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def skip(self) -> int:
        """Return MongoDB skip value."""

        return (self.page - 1) * self.page_size


class PaginatedData(BaseModel, Generic[T]):
    """Paginated collection payload."""

    items: list[T]
    total: int
    page: int
    page_size: int
