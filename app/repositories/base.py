"""Generic Beanie repository primitives."""

from typing import Any, Generic, TypeVar

from pymongo.errors import DuplicateKeyError, PyMongoError

from app.exceptions.exceptions import AppException, ConflictError, NotFoundError
from app.models.base import BaseDocument
from app.utils.datetime import utc_now
from app.utils.object_id import to_object_id

DocumentT = TypeVar("DocumentT", bound=BaseDocument)


class BaseRepository(Generic[DocumentT]):
    """Reusable async repository for Beanie documents."""

    model: type[DocumentT]

    def __init__(self, model: type[DocumentT]) -> None:
        self.model = model

    def _base_query(self, include_deleted: bool = False) -> dict[str, Any]:
        """Return a base query that excludes soft-deleted records by default."""

        if include_deleted:
            return {}
        return {"deleted_at": None}

    async def create(self, data: dict[str, Any]) -> DocumentT:
        """Create a document."""

        try:
            document = self.model(**data)
            await document.insert()
            return document
        except DuplicateKeyError as exc:
            raise ConflictError("Resource already exists") from exc
        except PyMongoError as exc:
            raise AppException("Database operation failed", status_code=503) from exc

    async def get(self, document_id: str, include_deleted: bool = False) -> DocumentT:
        """Get a document by ObjectId."""

        document = await self.model.get(to_object_id(document_id))
        if document is None:
            raise NotFoundError("Resource not found")
        if not include_deleted and document.deleted_at is not None:
            raise NotFoundError("Resource not found")
        return document

    async def find_one(
        self,
        filters: dict[str, Any],
        include_deleted: bool = False,
    ) -> DocumentT | None:
        """Find a single document by filters."""

        query = self._base_query(include_deleted=include_deleted)
        query.update(filters)
        return await self.model.find_one(query)

    async def list(
        self,
        skip: int = 0,
        limit: int = 20,
        filters: dict[str, Any] | None = None,
        include_deleted: bool = False,
    ) -> list[DocumentT]:
        """List documents with pagination."""

        query = self._base_query(include_deleted=include_deleted)
        if filters:
            query.update(filters)
        return await self.model.find(query).skip(skip).limit(limit).to_list()

    async def count(
        self,
        filters: dict[str, Any] | None = None,
        include_deleted: bool = False,
    ) -> int:
        """Count documents matching filters."""

        query = self._base_query(include_deleted=include_deleted)
        if filters:
            query.update(filters)
        return await self.model.find(query).count()

    async def update(self, document_id: str, data: dict[str, Any]) -> DocumentT:
        """Update a document by ObjectId."""

        document = await self.get(document_id)
        for field, value in data.items():
            setattr(document, field, value)
        document.updated_at = utc_now()
        try:
            await document.save()
            return document
        except DuplicateKeyError as exc:
            raise ConflictError("Resource already exists") from exc
        except PyMongoError as exc:
            raise AppException("Database operation failed", status_code=503) from exc

    async def soft_delete(self, document_id: str) -> DocumentT:
        """Soft delete a document by ObjectId."""

        document = await self.get(document_id)
        document.mark_deleted()
        try:
            await document.save()
            return document
        except PyMongoError as exc:
            raise AppException("Database operation failed", status_code=503) from exc
