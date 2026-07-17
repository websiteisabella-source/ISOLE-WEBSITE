"""Timezone-aware datetime helpers."""

from datetime import UTC, datetime


def utc_now() -> datetime:
    """Return the current UTC datetime."""

    return datetime.now(tz=UTC)
