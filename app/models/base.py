"""Base document with timestamps and soft-delete fields."""

from datetime import datetime

from beanie import Document, Insert, Replace, SaveChanges, before_event
from pydantic import ConfigDict, Field

from app.utils.datetime import utc_now


class BaseDocument(Document):
    """Shared fields for all MongoDB documents."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
    deleted_at: datetime | None = None
    is_active: bool = True

    @before_event(Insert)
    def set_created_timestamp(self) -> None:
        """Set creation and update timestamps before insertion."""

        now = utc_now()
        self.created_at = now
        self.updated_at = now

    @before_event(Replace, SaveChanges)
    def set_updated_timestamp(self) -> None:
        """Set the update timestamp before document replacement."""

        self.updated_at = utc_now()

    def mark_deleted(self) -> None:
        """Mark the document as softly deleted."""

        self.deleted_at = utc_now()
        self.is_active = False
        self.updated_at = utc_now()
