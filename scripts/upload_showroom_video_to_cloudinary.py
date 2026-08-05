"""Upload the showroom background video to Cloudinary."""

from __future__ import annotations

import asyncio
import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import cloudinary.uploader
from cloudinary.utils import cloudinary_url

import cloudinary as cloudinary_sdk
from app.config.settings import Settings

VIDEO_PATH = ROOT / "public" / "videos" / "isole-vacaciones-verano.mp4"
PUBLIC_ID = "isole-digital-showroom/isole-vacaciones-verano"


def configure_cloudinary(settings: Settings) -> None:
    """Configure Cloudinary SDK from local environment."""

    cloudinary_sdk.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret.get_secret_value(),
        secure=True,
    )


def optimized_video_url(public_id: str) -> str:
    """Return a Cloudinary delivery URL optimized for browsers."""

    url, _ = cloudinary_url(
        public_id,
        resource_type="video",
        secure=True,
        fetch_format="auto",
        quality="auto",
    )
    return url


async def main() -> None:
    """Upload the video and print its optimized delivery URL."""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--video-path",
        type=Path,
        default=VIDEO_PATH,
        help="Path to the local video file to upload.",
    )
    parser.add_argument(
        "--public-id",
        default=PUBLIC_ID,
        help="Cloudinary public_id to write.",
    )
    args = parser.parse_args()

    video_path = args.video_path
    if not video_path.is_absolute():
        video_path = ROOT / video_path
    video_path = video_path.resolve()

    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    settings = Settings()
    configure_cloudinary(settings)
    result = await asyncio.to_thread(
        cloudinary.uploader.upload,
        str(video_path),
        public_id=args.public_id,
        resource_type="video",
        overwrite=True,
        invalidate=True,
        use_filename=False,
        unique_filename=False,
    )

    print(f"public_id={result['public_id']}")
    print(f"bytes={result.get('bytes', 0)}")
    print(f"format={result.get('format', '')}")
    print(f"width={result.get('width', 0)}")
    print(f"height={result.get('height', 0)}")
    print(f"secure_url={result['secure_url']}")
    print(f"optimized_url={optimized_video_url(result['public_id'])}")


if __name__ == "__main__":
    asyncio.run(main())
