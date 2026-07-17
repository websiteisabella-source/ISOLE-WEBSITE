"""Domain-specific exceptions that map to safe API responses."""

from app.schemas.base import ErrorDetail


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        errors: list[ErrorDetail] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors or []


class AuthenticationError(AppException):
    """Raised when credentials or tokens are invalid."""

    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__(message=message, status_code=401)


class AuthorizationError(AppException):
    """Raised when a user lacks the required role or permission."""

    def __init__(self, message: str = "Insufficient permissions") -> None:
        super().__init__(message=message, status_code=403)


class NotFoundError(AppException):
    """Raised when a resource does not exist."""

    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(message=message, status_code=404)


class ConflictError(AppException):
    """Raised when a unique or state conflict occurs."""

    def __init__(self, message: str = "Resource conflict") -> None:
        super().__init__(message=message, status_code=409)


class ValidationAppError(AppException):
    """Raised when custom validation fails."""

    def __init__(
        self,
        message: str = "Validation error",
        errors: list[ErrorDetail] | None = None,
    ) -> None:
        super().__init__(message=message, status_code=422, errors=errors)
