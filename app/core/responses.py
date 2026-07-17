"""Helpers for the API response envelope."""

from typing import Any

from fastapi.responses import JSONResponse

from app.schemas.base import ErrorDetail


def success_response(
    message: str,
    data: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    """Return a successful API response."""

    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
            "errors": None,
        },
    )


def error_response(
    message: str,
    errors: list[ErrorDetail] | list[dict[str, Any]] | None = None,
    status_code: int = 400,
) -> JSONResponse:
    """Return a failed API response."""

    serializable_errors = [
        error.model_dump() if isinstance(error, ErrorDetail) else error for error in (errors or [])
    ]
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None,
            "errors": serializable_errors,
        },
    )
