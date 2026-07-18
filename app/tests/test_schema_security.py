"""Mass-assignment and payload strictness tests."""

import pytest
from pydantic import ValidationError

from app.schemas.auth import RefreshTokenRequest
from app.schemas.image import ImageUpdate
from app.schemas.setting import SettingCreate
from app.schemas.user import ProfileUpdate, UserUpdate


def test_user_update_rejects_role_and_verification_fields() -> None:
    """Role and verification state must not be client-editable fields."""

    with pytest.raises(ValidationError):
        UserUpdate.model_validate({"role": "admin"})

    with pytest.raises(ValidationError):
        UserUpdate.model_validate({"is_verified": True})


def test_profile_update_rejects_privilege_escalation_fields() -> None:
    """A user editing their profile cannot smuggle admin fields."""

    with pytest.raises(ValidationError):
        ProfileUpdate.model_validate({"first_name": "Isabella", "is_admin": True})


def test_image_and_setting_payloads_reject_unknown_fields() -> None:
    """Administrative payloads should reject unrecognized properties."""

    with pytest.raises(ValidationError):
        ImageUpdate.model_validate({"folder": "uploads", "public_id": "attempted-overwrite"})

    with pytest.raises(ValidationError):
        SettingCreate.model_validate({"key": "homepage", "value": {}, "permissions": ["*"]})


def test_auth_payloads_reject_unknown_fields() -> None:
    """Token flows should not accept extra client-controlled properties."""

    with pytest.raises(ValidationError):
        RefreshTokenRequest.model_validate({"refresh_token": "x" * 24, "role": "admin"})
