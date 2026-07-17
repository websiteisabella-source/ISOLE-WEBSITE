"""MongoDB integration tests."""

import os

import pytest

from app.config.settings import Settings
from app.database.database import close_database, connect_database, get_database


@pytest.mark.integration
@pytest.mark.asyncio
async def test_mongodb_connection_lifecycle() -> None:
    """Connect to MongoDB when integration tests are explicitly enabled."""

    if os.getenv("RUN_MONGODB_TESTS") != "1":
        pytest.skip("Set RUN_MONGODB_TESTS=1 to run MongoDB integration tests")

    settings = Settings(
        ENVIRONMENT="testing",
        MONGODB_URI=os.getenv("MONGODB_URI", "mongodb://localhost:27017"),
        DATABASE_NAME=os.getenv("DATABASE_NAME", "isole_showroom_test"),
        JWT_SECRET_KEY="test-access-secret-key-with-more-than-32-characters",
        JWT_REFRESH_SECRET_KEY="test-refresh-secret-key-with-more-than-32-characters",
        CORS_ORIGINS="http://localhost:3000",
    )

    await connect_database(settings)
    database = get_database()
    assert database.name == settings.database_name
    await close_database()
