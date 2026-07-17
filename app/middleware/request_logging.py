"""Access logging middleware."""

from time import perf_counter

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.logging.loggers import access_logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log request method, path, status, and latency."""

    async def dispatch(self, request: Request, call_next):
        """Log request lifecycle data."""

        started = perf_counter()
        response = await call_next(request)
        elapsed_ms = (perf_counter() - started) * 1000
        access_logger.info(
            "%s %s status=%s duration_ms=%.2f",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response
