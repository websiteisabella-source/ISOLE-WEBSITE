"""FastAPI exception handlers."""

import logging

from fastapi import FastAPI, Request
from fastapi import HTTPException as FastAPIHTTPException
from fastapi.exceptions import RequestValidationError

from app.core.responses import error_response
from app.exceptions.exceptions import AppException

logger = logging.getLogger(__name__)


async def app_exception_handler(_: Request, exc: AppException):
    """Map domain exceptions to the standard API envelope."""

    return error_response(
        message=exc.message,
        errors=exc.errors,
        status_code=exc.status_code,
    )


async def validation_exception_handler(_: Request, exc: RequestValidationError):
    """Map Pydantic validation failures to the standard API envelope."""

    errors = [
        {
            "field": ".".join(str(part) for part in error.get("loc", [])),
            "message": str(error.get("msg", "Invalid value")),
            "code": str(error.get("type", "validation_error")),
        }
        for error in exc.errors()
    ]
    return error_response(
        message="Validation error",
        errors=errors,
        status_code=422,
    )


async def http_exception_handler(_: Request, exc: FastAPIHTTPException):
    """Map FastAPI HTTP exceptions to the standard API envelope."""

    return error_response(
        message=str(exc.detail),
        errors=[],
        status_code=exc.status_code,
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    """Hide internal errors while logging diagnostic context."""

    logger.exception(
        "Unhandled error during %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )
    return error_response(
        message="Internal server error",
        errors=[],
        status_code=500,
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers on the FastAPI application."""

    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(FastAPIHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
