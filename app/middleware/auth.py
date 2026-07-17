"""Authentication context middleware."""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.auth.tokens import decode_token
from app.config.settings import Settings
from app.core.enums import TokenType


class AuthContextMiddleware(BaseHTTPMiddleware):
    """Decode bearer token metadata into request.state when present."""

    def __init__(self, app, settings: Settings) -> None:
        super().__init__(app)
        self.settings = settings

    async def dispatch(self, request: Request, call_next):
        """Attach best-effort auth context without enforcing authentication."""

        request.state.user_id = None
        request.state.role = None
        authorization = request.headers.get("authorization", "")
        if authorization.lower().startswith("bearer "):
            token = authorization.split(" ", maxsplit=1)[1]
            try:
                payload = decode_token(token, TokenType.ACCESS, self.settings)
                request.state.user_id = payload.get("sub")
                request.state.role = payload.get("role")
            except Exception:
                request.state.user_id = None
                request.state.role = None
        return await call_next(request)
