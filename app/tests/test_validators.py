"""Security validator tests."""

import pytest

from app.exceptions.exceptions import ValidationAppError
from app.validators.common import validate_password_strength, validate_slug
from app.validators.image import validate_cloudinary_folder
from app.validators.security import reject_nosql_injection, sanitize_text


def test_rejects_nosql_operator_keys() -> None:
    """MongoDB operator keys in request payloads should be rejected."""

    with pytest.raises(ValidationAppError):
        reject_nosql_injection({"email": {"$ne": "a@example.com"}})


def test_rejects_dot_keys_and_nested_arrays() -> None:
    """Dotted keys nested inside arrays should be rejected."""

    with pytest.raises(ValidationAppError):
        reject_nosql_injection({"items": [{"profile.name": "bad"}]})


def test_sanitize_text_trims_controls_and_escapes_html() -> None:
    """Text sanitization should normalize whitespace and escape HTML."""

    assert sanitize_text("  <b>Hello</b>\x00  world  ") == "&lt;b&gt;Hello&lt;/b&gt; world"


def test_validates_password_strength() -> None:
    """Weak passwords should fail validation."""

    with pytest.raises(ValueError):
        validate_password_strength("weak")

    assert validate_password_strength("StrongPass123") == "StrongPass123"


def test_validates_slug_format() -> None:
    """Slugs should use lowercase words separated by hyphens."""

    assert validate_slug("isole-dress-1") == "isole-dress-1"
    with pytest.raises(ValueError):
        validate_slug("ISOLE Dress")


def test_validates_cloudinary_folder_names() -> None:
    """Upload folders should be normalized and constrained."""

    assert validate_cloudinary_folder(" /showroom/new-arrivals ") == "showroom/new-arrivals"
    assert validate_cloudinary_folder(" ") == "uploads"
    with pytest.raises(ValidationAppError):
        validate_cloudinary_folder("../secrets")
