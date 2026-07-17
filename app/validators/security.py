"""Input security validation helpers."""

from collections.abc import Mapping, Sequence
from html import escape

from app.exceptions.exceptions import ValidationAppError
from app.schemas.base import ErrorDetail


def reject_nosql_injection(value, path: str = "body") -> None:
    """Reject MongoDB operator keys in user-provided payloads."""

    if isinstance(value, Mapping):
        for key, nested_value in value.items():
            if isinstance(key, str) and (key.startswith("$") or "." in key):
                raise ValidationAppError(
                    message="Unsafe payload",
                    errors=[
                        ErrorDetail(
                            field=path,
                            message="Payload contains unsafe query operator keys",
                            code="unsafe_payload",
                        ),
                    ],
                )
            reject_nosql_injection(nested_value, f"{path}.{key}")
    elif isinstance(value, Sequence) and not isinstance(value, str | bytes | bytearray):
        for index, nested_value in enumerate(value):
            reject_nosql_injection(nested_value, f"{path}.{index}")


def sanitize_text(value: str) -> str:
    """Trim text and escape HTML control characters."""

    normalized = " ".join(value.replace("\x00", "").split())
    return escape(normalized, quote=True)
