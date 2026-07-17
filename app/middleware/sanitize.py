"""Request body sanitization middleware."""

import json

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.responses import error_response
from app.exceptions.exceptions import ValidationAppError
from app.validators.security import reject_nosql_injection


class NoSQLInjectionMiddleware(BaseHTTPMiddleware):
    """Reject JSON payloads containing MongoDB operator keys."""

    async def dispatch(self, request: Request, call_next):
        """Validate JSON request bodies and replay them downstream."""

        if request.method not in {"POST", "PUT", "PATCH"}:
            return await call_next(request)
        content_type = request.headers.get("content-type", "")
        if "application/json" not in content_type:
            return await call_next(request)

        body = await request.body()
        if body:
            try:
                reject_nosql_injection(json.loads(body))
            except ValidationAppError as exc:
                return error_response(
                    message=exc.message,
                    errors=exc.errors,
                    status_code=exc.status_code,
                )
            except json.JSONDecodeError:
                return error_response(
                    message="Invalid JSON payload",
                    errors=[],
                    status_code=400,
                )

        async def receive():
            return {"type": "http.request", "body": body, "more_body": False}

        safe_request = Request(request.scope, receive)
        return await call_next(safe_request)
