"""Authentication and authorization dependencies."""

from collections.abc import Callable

from fastapi import Depends

from app.auth.permissions import has_permission
from app.auth.tokens import decode_token
from app.config.settings import Settings, get_settings
from app.core.enums import TokenType, UserRole
from app.exceptions.exceptions import AuthenticationError, AuthorizationError
from app.models.user import User
from app.repositories.token_blocklist import TokenBlocklistRepository
from app.repositories.users import UserRepository
from app.security.security import oauth2_scheme


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    settings: Settings = Depends(get_settings),
) -> User:
    """Resolve the current authenticated user from a bearer token."""

    payload = decode_token(token, TokenType.ACCESS, settings)
    blocklist = TokenBlocklistRepository()
    if await blocklist.is_blocklisted(payload["jti"]):
        raise AuthenticationError("Token has been revoked")

    user = await UserRepository().get(payload["sub"])
    if not user.is_active:
        raise AuthenticationError("User account is inactive")
    return user


async def get_current_admin(user: User = Depends(get_current_user)) -> User:
    """Require the current user to be an administrator."""

    if user.role != UserRole.ADMIN:
        raise AuthorizationError("Administrator role required")
    return user


def require_roles(*roles: UserRole) -> Callable:
    """Create a dependency that requires one of the provided roles."""

    async def _dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise AuthorizationError("Insufficient role")
        return user

    return _dependency


def require_permission(permission: str) -> Callable:
    """Create a dependency that requires a permission."""

    async def _dependency(user: User = Depends(get_current_user)) -> User:
        if not has_permission(user.role, permission):
            raise AuthorizationError("Insufficient permission")
        return user

    return _dependency
