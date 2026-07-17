"""Health check routes."""

from fastapi import APIRouter

from app.core.responses import success_response

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", summary="Health check")
async def health_check():
    """Return application health."""

    return success_response(
        message="Service is healthy",
        data={"status": "ok"},
    )
