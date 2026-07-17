"""MongoDB document models."""

from app.models.auth_token import (
    EmailVerificationToken,
    PasswordResetToken,
    RefreshToken,
    TokenBlocklist,
)
from app.models.category import Category
from app.models.image import ImageAsset
from app.models.product import Product
from app.models.setting import Setting
from app.models.user import User

DOCUMENT_MODELS = [
    User,
    RefreshToken,
    TokenBlocklist,
    PasswordResetToken,
    EmailVerificationToken,
    ImageAsset,
    Category,
    Product,
    Setting,
]

__all__ = [
    "DOCUMENT_MODELS",
    "Category",
    "EmailVerificationToken",
    "ImageAsset",
    "PasswordResetToken",
    "Product",
    "RefreshToken",
    "Setting",
    "TokenBlocklist",
    "User",
]
