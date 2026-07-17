"""Application enumerations."""

from enum import StrEnum


class UserRole(StrEnum):
    """Supported user roles."""

    ADMIN = "admin"
    USER = "user"


class TokenType(StrEnum):
    """Supported JWT token types."""

    ACCESS = "access"
    REFRESH = "refresh"


class ResourceType(StrEnum):
    """Cloudinary resource types used by this API."""

    IMAGE = "image"
