"""Image asset repository."""

from app.models.image import ImageAsset
from app.repositories.base import BaseRepository
from app.utils.object_id import to_object_id


class ImageRepository(BaseRepository[ImageAsset]):
    """Repository for Cloudinary image metadata."""

    def __init__(self) -> None:
        super().__init__(ImageAsset)

    async def get_by_public_id(self, public_id: str) -> ImageAsset | None:
        """Find an image by Cloudinary public id."""

        return await self.find_one({"public_id": public_id})

    async def list_by_ids(self, image_ids: list[str]) -> list[ImageAsset]:
        """Return active images matching the provided ids."""

        if not image_ids:
            return []
        object_ids = [to_object_id(image_id) for image_id in image_ids]
        return await self.model.find(
            {"_id": {"$in": object_ids}, "deleted_at": None},
        ).to_list()
