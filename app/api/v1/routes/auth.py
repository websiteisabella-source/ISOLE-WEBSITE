"""Authentication routes."""

from fastapi import APIRouter, Body, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.v1.dependencies.auth import get_current_user
from app.core.responses import success_response
from app.models.user import User
from app.schemas.auth import (
    EmailVerificationRequest,
    LogoutRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshTokenRequest,
    RegisterRequest,
)
from app.security.security import oauth2_scheme
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED, summary="Register")
async def register(payload: RegisterRequest):
    """Register a new user and issue JWT tokens."""

    data = await AuthService().register(payload)
    return success_response(
        message="User registered successfully",
        data=data,
        status_code=status.HTTP_201_CREATED,
    )


@router.post("/login", summary="Login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate with OAuth2 password form credentials."""

    data = await AuthService().authenticate(
        email=form_data.username,
        password=form_data.password,
    )
    return success_response(message="Login successful", data=data)


@router.post("/logout", summary="Logout")
async def logout(
    payload: LogoutRequest = Body(default_factory=LogoutRequest),
    token: str = Depends(oauth2_scheme),
    _: User = Depends(get_current_user),
):
    """Revoke current access token and optional refresh token."""

    await AuthService().logout(token, payload.refresh_token)
    return success_response(message="Logout successful", data={})


@router.post("/refresh", summary="Refresh token")
async def refresh(payload: RefreshTokenRequest):
    """Rotate a refresh token and return a new token pair."""

    data = await AuthService().refresh(payload.refresh_token)
    return success_response(message="Token refreshed successfully", data=data)


@router.post("/password/forgot", summary="Request password reset")
async def request_password_reset(payload: PasswordResetRequest):
    """Create a password reset token for email delivery."""

    data = await AuthService().request_password_reset(payload.email)
    return success_response(
        message="If the email exists, password reset instructions were generated",
        data=data,
    )


@router.post("/password/reset", summary="Reset password")
async def reset_password(payload: PasswordResetConfirm):
    """Reset password using a valid reset token."""

    await AuthService().reset_password(payload.token, payload.new_password)
    return success_response(message="Password reset successfully", data={})


@router.post("/email/verify", summary="Verify email")
async def verify_email(payload: EmailVerificationRequest):
    """Verify a user's email address."""

    await AuthService().verify_email(payload.token)
    return success_response(message="Email verified successfully", data={})
