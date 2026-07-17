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


class CatalogGroupKind(StrEnum):
    """Supported catalog grouping types."""

    COLLECTION = "collection"
    CLOTHING_TYPE = "clothing_type"


class ProductStatus(StrEnum):
    """Product publication states."""

    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
