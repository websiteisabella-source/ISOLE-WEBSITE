"""API v1 router composition."""

from fastapi import APIRouter

from app.api.v1.routes import (
    admin_catalog,
    auth,
    categories,
    health,
    images,
    products,
    profile,
    settings,
    uploads,
    users,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(admin_catalog.router)
api_router.include_router(users.router)
api_router.include_router(profile.router)
api_router.include_router(images.router)
api_router.include_router(uploads.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(settings.router)
