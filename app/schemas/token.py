"""Token schemas."""

from pydantic import BaseModel, Field


class TokenPairRead(BaseModel):
    """JWT token pair returned to authenticated clients."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token lifetime in seconds")


class TokenPayloadRead(BaseModel):
    """Decoded token payload used by auth dependencies."""

    sub: str
    type: str
    jti: str
    role: str | None = None
    permissions: list[str] = Field(default_factory=list)
