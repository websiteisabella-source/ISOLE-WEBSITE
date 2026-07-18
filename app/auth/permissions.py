"""Role and permission helpers."""

from app.core.enums import UserRole

ROLE_PERMISSIONS: dict[UserRole, set[str]] = {
    UserRole.ADMIN: {"*"},
    UserRole.USER: {
        "profile:read",
        "profile:update",
        "profile:change_password",
    },
}


def permissions_for_role(role: UserRole) -> list[str]:
    """Return permissions granted to a role."""

    return sorted(ROLE_PERMISSIONS.get(role, set()))


def has_permission(role: UserRole, permission: str) -> bool:
    """Return whether a role grants a specific permission."""

    permissions = ROLE_PERMISSIONS.get(role, set())
    return "*" in permissions or permission in permissions
