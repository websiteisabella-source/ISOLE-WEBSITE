"""Upload local showroom images to Cloudinary and mirror metadata in MongoDB."""

from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import cloudinary.api
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from pymongo.errors import PyMongoError

import cloudinary as cloudinary_sdk
from app.config.settings import Settings
from app.core.enums import ResourceType
from app.database.database import close_database, connect_database
from app.models.category import Category
from app.models.image import ImageAsset
from app.models.product import Product
from app.models.setting import Setting

IMAGE_DIR = ROOT / "public" / "images"
OUTPUT_TS = ROOT / "lib" / "cloudinary-assets.ts"
CLOUDINARY_FOLDER = "isole-digital-showroom"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

PRODUCTS = [
    {
        "slug": "vestido-atardecer",
        "name": "Vestido Atardecer",
        "category": "Vestidos",
        "description": (
            "Un vestido de lino que cae como la ultima luz de la tarde. Pensado para "
            "moverse con el viento y abrazar el cuerpo sin pedir permiso."
        ),
        "fabric": "Lino 100% natural",
        "colors": ["Atardecer Coral", "Nude"],
        "product": "/images/arrival-1-product.png",
        "model": "/images/arrival-1-model.png",
        "gallery": [
            "/images/arrival-1-model.png",
            "/images/detail-back.png",
            "/images/detail-texture.png",
            "/images/detail-lifestyle.png",
        ],
    },
    {
        "slug": "blusa-seda-alba",
        "name": "Blusa Seda Alba",
        "category": "Blusas",
        "description": (
            "La calma de la manana hecha prenda. Una blusa de seda que se desliza "
            "sobre la piel con una elegancia silenciosa y atemporal."
        ),
        "fabric": "Seda lavada",
        "colors": ["Crema", "Petalo Rosa"],
        "product": "/images/arrival-2-product.png",
        "model": "/images/arrival-2-model.png",
        "gallery": [
            "/images/arrival-2-model.png",
            "/images/arrival-2-product.png",
            "/images/editorial-story.png",
        ],
    },
    {
        "slug": "slip-petalo",
        "name": "Slip Petalo",
        "category": "Vestidos",
        "description": (
            "Un slip dress de saten en tono petalo, romantico y desnudo. Hecho para "
            "las noches calidas y los momentos que se quedan."
        ),
        "fabric": "Saten de viscosa",
        "colors": ["Petalo Rosa", "Lavanda Viva"],
        "product": "/images/arrival-3-product.png",
        "model": "/images/arrival-3-model.png",
        "gallery": [
            "/images/arrival-3-model.png",
            "/images/collection-3.png",
            "/images/collection-4.png",
        ],
    },
]


def configure_cloudinary(settings: Settings) -> None:
    """Configure the Cloudinary SDK without logging secrets."""

    cloudinary_sdk.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret.get_secret_value(),
        secure=True,
    )


def public_id_for(path: Path) -> str:
    """Return the deterministic Cloudinary public id for a local image."""

    return f"{CLOUDINARY_FOLDER}/{path.stem}"


def local_url_for(path: Path) -> str:
    """Return the public URL used by the Next.js app for a local image."""

    return f"/images/{path.name}"


def optimized_url(public_id: str) -> str:
    """Return a Cloudinary delivery URL tuned for browser loading."""

    url, _ = cloudinary_url(
        public_id,
        secure=True,
        fetch_format="auto",
        quality="auto",
    )
    return url


async def upsert_image_asset(
    upload_result: dict[str, Any],
    local_path: Path,
) -> ImageAsset:
    """Create or update the MongoDB metadata document for one image."""

    payload = {
        "public_id": upload_result["public_id"],
        "asset_id": upload_result["asset_id"],
        "secure_url": upload_result["secure_url"],
        "format": upload_result.get("format", ""),
        "width": upload_result.get("width", 0),
        "height": upload_result.get("height", 0),
        "bytes": upload_result.get("bytes", 0),
        "folder": CLOUDINARY_FOLDER,
        "resource_type": ResourceType.IMAGE,
        "original_filename": local_path.name,
        "uploaded_by": "migration:local-assets",
        "is_active": True,
        "deleted_at": None,
    }

    existing = await ImageAsset.find_one(ImageAsset.public_id == payload["public_id"])
    if existing is None:
        return await ImageAsset(**payload).insert()

    for key, value in payload.items():
        setattr(existing, key, value)
    await existing.save()
    return existing


async def upload_images() -> tuple[dict[str, dict[str, Any]], list[ImageAsset]]:
    """Upload all local images and persist their metadata."""

    image_paths = sorted(
        path
        for path in IMAGE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )
    manifest: dict[str, dict[str, Any]] = {}
    documents: list[ImageAsset] = []

    for path in image_paths:
        public_id = public_id_for(path)
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            str(path),
            public_id=public_id,
            resource_type="image",
            overwrite=True,
            invalidate=True,
            use_filename=False,
            unique_filename=False,
        )
        document = await upsert_image_asset(result, path)
        local_url = local_url_for(path)

        manifest[local_url] = {
            "public_id": result["public_id"],
            "asset_id": result["asset_id"],
            "secure_url": result["secure_url"],
            "optimized_url": optimized_url(result["public_id"]),
            "width": result.get("width", 0),
            "height": result.get("height", 0),
            "bytes": result.get("bytes", 0),
            "format": result.get("format", ""),
            "mongo_id": str(document.id),
        }
        documents.append(document)
        print(f"uploaded {local_url} -> {result['public_id']}")

    return manifest, documents


async def upsert_category(name: str) -> Category:
    """Create or update a product category."""

    slug = name.lower().replace(" ", "-")
    existing = await Category.find_one(Category.slug == slug)
    if existing is None:
        return await Category(name=name, slug=slug, is_active=True).insert()

    existing.name = name
    existing.is_active = True
    existing.deleted_at = None
    await existing.save()
    return existing


async def upsert_products(manifest: dict[str, dict[str, Any]]) -> int:
    """Create or update product documents with image references."""

    count = 0
    for seed in PRODUCTS:
        category = await upsert_category(seed["category"])
        image_paths = [seed["product"], seed["model"], *seed["gallery"]]
        unique_image_paths = list(dict.fromkeys(image_paths))
        image_ids = [
            manifest[path]["mongo_id"]
            for path in unique_image_paths
            if path in manifest
        ]
        gallery_urls = [
            manifest[path]["optimized_url"]
            for path in seed["gallery"]
            if path in manifest
        ]

        payload = {
            "name": seed["name"],
            "slug": seed["slug"],
            "description": seed["description"],
            "price": 0,
            "currency": "COP",
            "sku": f"ISOLE-{seed['slug'].upper()}",
            "stock": 0,
            "category_ids": [str(category.id)],
            "image_ids": image_ids,
            "attributes": {
                "fabric": seed["fabric"],
                "colors": seed["colors"],
                "local_product_image": seed["product"],
                "local_model_image": seed["model"],
                "local_gallery": seed["gallery"],
                "product_image_url": manifest.get(seed["product"], {}).get("optimized_url"),
                "model_image_url": manifest.get(seed["model"], {}).get("optimized_url"),
                "gallery_urls": gallery_urls,
            },
            "is_featured": True,
            "is_active": True,
            "deleted_at": None,
        }

        existing = await Product.find_one(Product.slug == seed["slug"])
        if existing is None:
            await Product(**payload).insert()
        else:
            for key, value in payload.items():
                setattr(existing, key, value)
            await existing.save()
        count += 1

    return count


async def upsert_manifest_setting(manifest: dict[str, dict[str, Any]]) -> None:
    """Store the Cloudinary asset manifest in MongoDB settings."""

    value = {
        "folder": CLOUDINARY_FOLDER,
        "assets": manifest,
    }
    existing = await Setting.find_one(Setting.key == "cloudinary_asset_manifest")
    if existing is None:
        await Setting(
            key="cloudinary_asset_manifest",
            value=value,
            description="Public Cloudinary image manifest generated from local showroom assets.",
            is_public=True,
        ).insert()
        return

    existing.value = value
    existing.description = "Public Cloudinary image manifest generated from local showroom assets."
    existing.is_public = True
    existing.is_active = True
    existing.deleted_at = None
    await existing.save()


def write_typescript_manifest(manifest: dict[str, dict[str, Any]]) -> None:
    """Write a TypeScript helper consumed by the static frontend."""

    optimized_mapping = {
        local_path: data["optimized_url"]
        for local_path, data in sorted(manifest.items())
    }
    body = json.dumps(optimized_mapping, indent=2, ensure_ascii=False)
    OUTPUT_TS.write_text(
        "\n".join(
            [
                "/* This file is generated by scripts/migrate_assets_to_cloudinary.py. */",
                f"export const cloudinaryAssets = {body} as const",
                "",
                "export type CloudinaryAssetPath = keyof typeof cloudinaryAssets",
                "",
                "export function cloudinaryImage(path: string) {",
                "  return cloudinaryAssets[path as CloudinaryAssetPath] ?? path",
                "}",
                "",
            ],
        ),
        encoding="utf-8",
    )


async def main() -> None:
    """Run the asset migration."""

    settings = Settings()
    configure_cloudinary(settings)
    await connect_database(settings)
    try:
        manifest, image_documents = await upload_images()
        product_count = await upsert_products(manifest)
        await upsert_manifest_setting(manifest)
        write_typescript_manifest(manifest)
    except PyMongoError:
        raise
    finally:
        await close_database()

    print(
        "migration-ok: "
        f"{len(image_documents)} images, {product_count} products, "
        "1 cloudinary_asset_manifest setting"
    )


if __name__ == "__main__":
    asyncio.run(main())
