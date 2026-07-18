"""Authentication request and response schemas."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.token import TokenPairRead
from app.schemas.user import UserCreate, UserRead
from app.validators.common import validate_password_strength


class RegisterRequest(UserCreate):
    """Registration payload."""


class AuthenticatedUserRead(BaseModel):
    """Authenticated user and token pair."""

    user: UserRead
    tokens: TokenPairRead


class RefreshTokenRequest(BaseModel):
    """Refresh token payload."""

    model_config = ConfigDict(extra="forbid")

    refresh_token: str = Field(min_length=20)


class LogoutRequest(BaseModel):
    """Logout payload."""

    model_config = ConfigDict(extra="forbid")

    refresh_token: str | None = Field(default=None, min_length=20)


class PasswordResetRequest(BaseModel):
    """Request a password reset token."""

    model_config = ConfigDict(extra="forbid")

    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Reset a password with a token."""

    model_config = ConfigDict(extra="forbid")

    token: str = Field(min_length=20)
    new_password: str = Field(min_length=8, max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        """Validate the new password strength."""

        return validate_password_strength(value)


class EmailVerificationRequest(BaseModel):
    """Verify an email address with a token."""

    model_config = ConfigDict(extra="forbid")

    token: str = Field(min_length=20)
