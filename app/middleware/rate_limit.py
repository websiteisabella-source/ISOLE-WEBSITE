"""Simple in-process rate limiting middleware."""

from collections import defaultdict, deque
from time import monotonic

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.config.settings import Settings
from app.core.responses import error_response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Sliding-window rate limiter for API requests."""

    SENSITIVE_PATH_PREFIXES = (
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/refresh",
        "/api/v1/auth/password/forgot",
        "/api/v1/auth/password/reset",
        "/api/v1/auth/email/verify",
    )

    def __init__(self, app, settings: Settings) -> None:
        super().__init__(app)
        self.requests: dict[str, deque[float]] = defaultdict(deque)
        self.limit = settings.rate_limit_requests
        self.window = settings.rate_limit_window_seconds
        self.auth_limit = settings.auth_rate_limit_requests
        self.auth_window = settings.auth_rate_limit_window_seconds

    async def dispatch(self, request: Request, call_next):
        """Apply rate limits per client and path."""

        if request.url.path.startswith(("/docs", "/redoc", "/openapi.json")):
            return await call_next(request)

        now = monotonic()
        forwarded_for = request.headers.get("x-forwarded-for", "")
        client = forwarded_for.split(",", maxsplit=1)[0].strip()
        if not client:
            client = request.client.host if request.client else "unknown"
        limit, window = self._limit_for_path(request.url.path)
        key = f"{client}:{request.url.path}"
        bucket = self.requests[key]
        while bucket and now - bucket[0] > window:
            bucket.popleft()

        if len(bucket) >= limit:
            response = error_response(
                message="Too many requests",
                errors=[],
                status_code=429,
            )
            response.headers["Retry-After"] = str(window)
            return response

        bucket.append(now)
        return await call_next(request)

    def _limit_for_path(self, path: str) -> tuple[int, int]:
        """Return the request budget for a path."""

        if path.startswith(self.SENSITIVE_PATH_PREFIXES):
            return self.auth_limit, self.auth_window
        return self.limit, self.window
