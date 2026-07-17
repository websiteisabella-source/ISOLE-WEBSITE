"""FastAPI application factory."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.cloudinary.cloudinary_service import configure_cloudinary
from app.config.logging import configure_logging
from app.config.settings import get_settings
from app.core.constants import API_V1_PREFIX
from app.database.database import close_database, connect_database
from app.exceptions.handlers import register_exception_handlers
from app.middleware.auth import AuthContextMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware
from app.middleware.sanitize import NoSQLInjectionMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

settings = get_settings()
configure_logging(settings)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Manage application startup and shutdown resources."""

    configure_cloudinary(settings)
    await connect_database(settings)
    yield
    await close_database()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        description="Production-ready backend for the ISOLE digital showroom.",
        debug=settings.debug,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    cors_origins = settings.cors_origins or [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(AuthContextMiddleware, settings=settings)
    app.add_middleware(NoSQLInjectionMiddleware)
    app.add_middleware(RateLimitMiddleware, settings=settings)

    register_exception_handlers(app)
    app.include_router(api_router, prefix=API_V1_PREFIX)
    return app


app = create_app()
