"""Common Pydantic validators."""

import re

from app.core.constants import PASSWORD_MIN_LENGTH

PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate_password_strength(password: str) -> str:
    """Validate password complexity."""

    if len(password) < PASSWORD_MIN_LENGTH:
        raise ValueError(f"Password must be at least {PASSWORD_MIN_LENGTH} characters")
    if not PASSWORD_PATTERN.match(password):
        raise ValueError(
            "Password must contain uppercase, lowercase, and numeric characters",
        )
    return password


def validate_slug(slug: str) -> str:
    """Validate URL-friendly slugs."""

    if not SLUG_PATTERN.match(slug):
        raise ValueError("Slug must use lowercase letters, numbers, and hyphens")
    return slug
