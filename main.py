"""Uvicorn entry point for the FastAPI backend."""

import uvicorn
from app.config.settings import get_settings
from app.main import app  # noqa: F401


def run() -> None:
    """Run the API with Uvicorn."""

    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug and not settings.is_production,
    )


if __name__ == "__main__":
    run()
