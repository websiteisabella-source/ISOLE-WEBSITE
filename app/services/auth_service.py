"""Authentication use cases."""

from datetime import timedelta

from app.auth.password import hash_password, verify_password
from app.auth.permissions import permissions_for_role
from app.auth.tokens import (
    create_access_token,
    create_random_token,
    create_refresh_token,
    decode_token,
    hash_token,
    jwt_exp_to_datetime,
)
from app.config.settings import Settings, get_settings
from app.core.constants import (
    EMAIL_VERIFICATION_TOKEN_HOURS,
    PASSWORD_RESET_TOKEN_MINUTES,
)
from app.core.enums import TokenType, UserRole
from app.exceptions.exceptions import AuthenticationError, ConflictError, NotFoundError
from app.logging.loggers import security_logger
from app.models.user import User
from app.repositories.email_tokens import EmailVerificationTokenRepository
from app.repositories.password_tokens import PasswordResetTokenRepository
from app.repositories.refresh_tokens import RefreshTokenRepository
from app.repositories.token_blocklist import TokenBlocklistRepository
from app.repositories.users import UserRepository
from app.schemas.auth import RegisterRequest
from app.schemas.user import ChangePasswordRequest
from app.utils.datetime import utc_now
from app.utils.object_id import serialize_document


class AuthService:
    """Authentication and account-security workflows."""

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.users = UserRepository()
        self.refresh_tokens = RefreshTokenRepository()
        self.blocklist = TokenBlocklistRepository()
        self.password_tokens = PasswordResetTokenRepository()
        self.email_tokens = EmailVerificationTokenRepository()

    async def register(self, payload: RegisterRequest) -> dict:
        """Register a user and issue a token pair."""

        email = payload.email.lower()
        if await self.users.get_by_email(email):
            raise ConflictError("Email is already registered")

        is_first_user = await self.users.count() == 0
        role = (
            UserRole.ADMIN
            if is_first_user and self.settings.initial_admin_bootstrap_enabled
            else UserRole.USER
        )
        user = await self.users.create(
            {
                "email": email,
                "hashed_password": hash_password(payload.password),
                "first_name": payload.first_name,
                "last_name": payload.last_name,
                "role": role,
                "permissions": permissions_for_role(role),
            },
        )
        verification_token = await self.create_email_verification_token(user)
        tokens = await self._issue_token_pair(user)
        security_logger.info("User registered: %s", email)
        response: dict[str, object] = {
            "user": serialize_document(user),
            "tokens": tokens,
        }
        if not self.settings.is_production:
            response["email_verification_token"] = verification_token
        return response

    async def authenticate(self, email: str, password: str) -> dict:
        """Authenticate a user with email and password."""

        user = await self.users.get_by_email(email.lower())
        if user is None or not verify_password(password, user.hashed_password):
            security_logger.warning("Failed login attempt for email=%s", email)
            raise AuthenticationError("Invalid email or password")
        if not user.is_active:
            raise AuthenticationError("User account is inactive")

        user.last_login_at = utc_now()
        await user.save()
        security_logger.info("User login: %s", email)
        return {
            "user": serialize_document(user),
            "tokens": await self._issue_token_pair(user),
        }

    async def refresh(self, refresh_token: str) -> dict:
        """Rotate a refresh token and issue a new token pair."""

        payload = decode_token(refresh_token, TokenType.REFRESH, self.settings)
        stored_token = await self.refresh_tokens.get_active_by_hash(
            hash_token(refresh_token),
        )
        if stored_token is None or stored_token.jti != payload["jti"]:
            raise AuthenticationError("Invalid refresh token")

        user = await self.users.get(payload["sub"])
        if not user.is_active:
            raise AuthenticationError("User account is inactive")

        await self.refresh_tokens.revoke(stored_token)
        return {
            "user": serialize_document(user),
            "tokens": await self._issue_token_pair(user),
        }

    async def logout(
        self,
        access_token: str,
        refresh_token: str | None = None,
    ) -> None:
        """Revoke tokens for logout."""

        payload = decode_token(access_token, TokenType.ACCESS, self.settings)
        await self.blocklist.blocklist(
            jti=payload["jti"],
            expires_at=jwt_exp_to_datetime(payload["exp"]),
            reason="logout",
        )
        if refresh_token:
            refresh_payload = decode_token(refresh_token, TokenType.REFRESH, self.settings)
            stored_token = await self.refresh_tokens.get_active_by_hash(
                hash_token(refresh_token),
            )
            if stored_token and stored_token.jti == refresh_payload["jti"]:
                await self.refresh_tokens.revoke(stored_token)
        security_logger.info("User logout: %s", payload["sub"])

    async def change_password(
        self,
        user: User,
        payload: ChangePasswordRequest,
    ) -> None:
        """Change password for an authenticated user."""

        if not verify_password(payload.current_password, user.hashed_password):
            raise AuthenticationError("Invalid current password")
        user.hashed_password = hash_password(payload.new_password)
        await user.save()
        await self.refresh_tokens.revoke_all_for_user(str(user.id))
        security_logger.info("Password changed for user=%s", user.email)

    async def request_password_reset(self, email: str) -> dict:
        """Create a password reset token when the user exists."""

        user = await self.users.get_by_email(email.lower())
        response: dict = {"delivery": "email"}
        if user is None:
            security_logger.info("Password reset requested for unknown email=%s", email)
            return response

        raw_token = create_random_token()
        await self.password_tokens.create(
            {
                "user_id": str(user.id),
                "token_hash": hash_token(raw_token),
                "expires_at": utc_now() + timedelta(minutes=PASSWORD_RESET_TOKEN_MINUTES),
            },
        )
        security_logger.info("Password reset requested for user=%s", user.email)
        if not self.settings.is_production:
            response["reset_token"] = raw_token
        return response

    async def reset_password(self, token: str, new_password: str) -> None:
        """Reset password using a valid reset token."""

        stored_token = await self.password_tokens.get_valid_by_hash(hash_token(token))
        if stored_token is None:
            raise AuthenticationError("Invalid or expired reset token")
        user = await self.users.get(stored_token.user_id)
        user.hashed_password = hash_password(new_password)
        await user.save()
        await self.password_tokens.mark_used(stored_token)
        await self.refresh_tokens.revoke_all_for_user(str(user.id))
        security_logger.info("Password reset completed for user=%s", user.email)

    async def verify_email(self, token: str) -> None:
        """Verify a user's email address."""

        stored_token = await self.email_tokens.get_valid_by_hash(hash_token(token))
        if stored_token is None:
            raise AuthenticationError("Invalid or expired verification token")
        user = await self.users.get(stored_token.user_id)
        user.is_verified = True
        await user.save()
        await self.email_tokens.mark_used(stored_token)
        security_logger.info("Email verified for user=%s", user.email)

    async def create_email_verification_token(self, user: User) -> str:
        """Create an email verification token for a user."""

        raw_token = create_random_token()
        await self.email_tokens.create(
            {
                "user_id": str(user.id),
                "token_hash": hash_token(raw_token),
                "expires_at": utc_now() + timedelta(hours=EMAIL_VERIFICATION_TOKEN_HOURS),
            },
        )
        return raw_token

    async def _issue_token_pair(self, user: User) -> dict:
        """Issue and persist an access/refresh token pair."""

        access_token, _, access_expires_at = create_access_token(
            str(user.id),
            user.role,
            user.permissions,
            self.settings,
        )
        refresh_token, refresh_jti, refresh_expires_at = create_refresh_token(
            str(user.id),
            self.settings,
        )
        await self.refresh_tokens.create(
            {
                "user_id": str(user.id),
                "token_hash": hash_token(refresh_token),
                "jti": refresh_jti,
                "expires_at": refresh_expires_at,
            },
        )
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": int((access_expires_at - utc_now()).total_seconds()),
        }

    async def get_user_or_404(self, user_id: str) -> User:
        """Return an active user or raise not found."""

        try:
            return await self.users.get(user_id)
        except NotFoundError:
            raise AuthenticationError("Invalid user") from None
