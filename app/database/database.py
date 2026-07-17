"""MongoDB connection lifecycle."""

import logging

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError

from app.config.settings import Settings, get_settings
from app.exceptions.exceptions import AppException
from app.models import DOCUMENT_MODELS

logger = logging.getLogger(__name__)


class MongoConnection:
    """Centralized async MongoDB connection manager."""

    client: AsyncIOMotorClient | None = None
    database: AsyncIOMotorDatabase | None = None

    async def connect(self, settings: Settings) -> None:
        """Connect to MongoDB and initialize Beanie models."""

        if self.client is not None:
            return
        try:
            self.client = AsyncIOMotorClient(
                settings.mongodb_uri,
                serverSelectionTimeoutMS=5000,
                uuidRepresentation="standard",
            )
            await self.client.admin.command("ping")
            self.database = self.client[settings.database_name]
            await init_beanie(
                database=self.database,
                document_models=DOCUMENT_MODELS,
            )
            logger.info("MongoDB connected to database %s", settings.database_name)
        except PyMongoError as exc:
            logger.exception("MongoDB connection failed")
            self.client = None
            self.database = None
            raise AppException("Database connection failed", status_code=503) from exc

    async def close(self) -> None:
        """Close MongoDB client resources."""

        if self.client is not None:
            self.client.close()
            self.client = None
            self.database = None
            logger.info("MongoDB connection closed")


mongo = MongoConnection()


async def connect_database(settings: Settings | None = None) -> None:
    """Connect the application database."""

    await mongo.connect(settings or get_settings())


async def close_database() -> None:
    """Close the application database."""

    await mongo.close()


def get_database() -> AsyncIOMotorDatabase:
    """Return the initialized database or raise a service error."""

    if mongo.database is None:
        raise AppException("Database is not initialized", status_code=503)
    return mongo.database
