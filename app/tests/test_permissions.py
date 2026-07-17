"""Permission helper tests."""

from app.auth.permissions import has_permission, permissions_for_role
from app.core.enums import UserRole


def test_admin_has_wildcard_permissions() -> None:
    """Administrators should have wildcard access."""

    assert "*" in permissions_for_role(UserRole.ADMIN)
    assert has_permission(UserRole.ADMIN, "settings:delete")


def test_user_permissions_are_limited() -> None:
    """Regular users should only receive explicit permissions."""

    assert "profile:read" in permissions_for_role(UserRole.USER)
    assert has_permission(UserRole.USER, "profile:update")
    assert not has_permission(UserRole.USER, "settings:delete")
