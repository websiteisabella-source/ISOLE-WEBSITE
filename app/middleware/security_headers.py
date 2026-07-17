"""HTTP security headers middleware."""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.config.settings import Settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Attach security headers to every response."""

    def __init__(self, app, settings: Settings) -> None:
        super().__init__(app)
        self.is_production = settings.is_production

    async def dispatch(self, request: Request, call_next):
        """Add defensive headers to the response."""

        response = await call_next(request)
        is_dev_docs = (not self.is_production) and request.url.path.startswith(
            ("/docs", "/redoc", "/openapi.json"),
        )
        if not is_dev_docs:
            response.headers.setdefault(
                "Content-Security-Policy",
                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
            )
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
        response.headers.setdefault(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()",
        )
        response.headers.setdefault("X-XSS-Protection", "0")
        if request.url.path.startswith(("/api/v1/auth", "/api/v1/profile")):
            response.headers.setdefault("Cache-Control", "no-store")
            response.headers.setdefault("Pragma", "no-cache")
        if self.is_production:
            response.headers.setdefault(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload",
            )
        return response
