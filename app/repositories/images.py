"""Image asset repository."""

from app.models.image import ImageAsset
from app.repositories.base import BaseRepository


class ImageRepository(BaseRepository[ImageAsset]):
    """Repository for Cloudinary image metadata."""

    def __init__(self) -> None:
        super().__init__(ImageAsset)

    async def get_by_public_id(self, public_id: str) -> ImageAsset | None:
        """Find an image by Cloudinary public id."""

        return await self.find_one({"public_id": public_id})
