"""ObjectId validation and serialization helpers."""

from beanie import PydanticObjectId

from app.exceptions.exceptions import ValidationAppError
from app.schemas.base import ErrorDetail


def to_object_id(value: str | PydanticObjectId) -> PydanticObjectId:
    """Convert a string to a Beanie ObjectId or raise a validation error."""

    if isinstance(value, PydanticObjectId):
        return value
    try:
        return PydanticObjectId(value)
    except Exception as exc:
        raise ValidationAppError(
            errors=[
                ErrorDetail(
                    field="id",
                    message="Invalid MongoDB ObjectId",
                    code="invalid_object_id",
                ),
            ],
        ) from exc


def serialize_document(document) -> dict:
    """Serialize a Beanie document for JSON responses."""

    data = document.model_dump(mode="json")
    data["id"] = str(document.id)
    data.pop("hashed_password", None)
    return data
