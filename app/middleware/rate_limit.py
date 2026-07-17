"""Simple in-process rate limiting middleware."""

from collections import defaultdict, deque
from time import monotonic

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.config.settings import Settings
from app.core.responses import error_response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding-window rate limiter for API requests."""

    def __init__(self, app, settings: Settings) -> None:
        super().__init__(app)
        self.requests: dict[str, deque[float]] = defaultdict(deque)
        self.limit = settings.rate_limit_requests
        self.window = settings.rate_limit_window_seconds

    async def dispatch(self, request: Request, call_next):
        """Apply rate limits per client and path."""

        if request.url.path.startswith(("/docs", "/redoc", "/openapi.json")):
            return await call_next(request)

        now = monotonic()
        client = request.client.host if request.client else "unknown"
        key = f"{client}:{request.url.path}"
        bucket = self.requests[key]
        while bucket and now - bucket[0] > self.window:
            bucket.popleft()

        if len(bucket) >= self.limit:
            response = error_response(
                message="Too many requests",
                errors=[],
                status_code=429,
            )
            response.headers["Retry-After"] = str(self.window)
            return response

        bucket.append(now)
        return await call_next(request)
