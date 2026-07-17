"""Image asset service."""

from fastapi import UploadFile

from app.cloudinary.cloudinary_service import CloudinaryService
from app.exceptions.exceptions import NotFoundError
from app.logging.loggers import security_logger
from app.repositories.images import ImageRepository
from app.schemas.image import ImageUpdate
from app.utils.object_id import serialize_document


class ImageService:
    """Cloudinary image workflows."""

    def __init__(self) -> None:
        self.images = ImageRepository()
        self.cloudinary = CloudinaryService()

    async def upload_image(
        self,
        file: UploadFile,
        folder: str,
        uploaded_by: str | None,
    ) -> dict:
        """Upload an image and persist Cloudinary metadata."""

        metadata = await self.cloudinary.upload_image(file, folder=folder)
        metadata["uploaded_by"] = uploaded_by
        image = await self.images.create(metadata)
        security_logger.info("Image uploaded public_id=%s", image.public_id)
        return serialize_document(image)

    async def list_images(self, skip: int, limit: int) -> tuple[list[dict], int]:
        """List image metadata."""

        images = await self.images.list(skip=skip, limit=limit)
        total = await self.images.count()
        return [serialize_document(image) for image in images], total

    async def get_image(self, image_id: str) -> dict:
        """Get stored image metadata by id."""

        image = await self.images.get(image_id)
        return serialize_document(image)

    async def get_cloudinary_image(self, public_id: str) -> dict:
        """Get live Cloudinary metadata by public id."""

        image = await self.images.get_by_public_id(public_id)
        if image is None:
            raise NotFoundError("Image not found")
        return await self.cloudinary.get_image(public_id)

    async def update_image(self, image_id: str, payload: ImageUpdate) -> dict:
        """Update editable image metadata."""

        image = await self.images.update(
            image_id,
            payload.model_dump(exclude_unset=True),
        )
        return serialize_document(image)

    async def replace_image(self, image_id: str, file: UploadFile) -> dict:
        """Replace an image in Cloudinary and update metadata."""

        current = await self.images.get(image_id)
        metadata = await self.cloudinary.replace_image(current.public_id, file)
        metadata["uploaded_by"] = current.uploaded_by
        updated = await self.images.update(str(current.id), metadata)
        security_logger.info("Image replaced public_id=%s", updated.public_id)
        return serialize_document(updated)

    async def delete_image(self, image_id: str) -> dict:
        """Delete an image from Cloudinary and soft-delete metadata."""

        image = await self.images.get(image_id)
        await self.cloudinary.delete_image(image.public_id)
        deleted = await self.images.soft_delete(image_id)
        security_logger.info("Image deleted public_id=%s", image.public_id)
        return serialize_document(deleted)

    async def signed_url(self, image_id: str) -> dict:
        """Generate a signed delivery URL for an image."""

        image = await self.images.get(image_id)
        return {"url": await self.cloudinary.generate_signed_url(image.public_id)}
