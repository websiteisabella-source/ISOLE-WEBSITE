"""Database configuration view."""

from pydantic import BaseModel

from app.config.settings import get_settings


class DatabaseSettings(BaseModel):
    """MongoDB settings consumed by the database layer."""

    mongodb_uri: str
    database_name: str


def get_database_settings() -> DatabaseSettings:
    """Return validated database settings."""

    settings = get_settings()
    return DatabaseSettings(
        mongodb_uri=settings.mongodb_uri,
        database_name=settings.database_name,
    )
