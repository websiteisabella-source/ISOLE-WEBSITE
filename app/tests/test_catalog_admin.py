"""Catalog admin unit tests."""

import pytest
from pydantic import ValidationError

from app.core.enums import CatalogGroupKind, ProductStatus
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.product_service import ProductService


def test_publication_errors_require_public_fields() -> None:
    """Incomplete draft data should report every blocker."""

    errors = ProductService().publication_errors(
        {
            "name": "Pantalon Christina",
            "slug": "pantalon-christina",
            "image_ids": [],
            "collection_ids": [],
            "clothing_type_ids": [],
        }
    )

    assert "Falta una descripcion." in errors
    assert "Falta al menos una imagen." in errors
    assert "Falta una coleccion o tipo de ropa." in errors


def test_publication_errors_accept_complete_public_data() -> None:
    """A product with content, media and a group can be published."""

    errors = ProductService().publication_errors(
        {
            "name": "Vestido Cayena",
            "slug": "vestido-cayena",
            "short_description": "Una silueta fluida para dias de sol.",
            "image_ids": ["64b7f04beadf8600017de111"],
            "collection_ids": ["64b7f04beadf8600017de222"],
            "clothing_type_ids": [],
        }
    )

    assert errors == []


def test_product_create_adds_primary_image_to_gallery() -> None:
    """Primary image must always belong to image_ids."""

    payload = ProductCreate(
        name="Blusa Vitta",
        slug="blusa-vitta",
        primary_image_id="64b7f04beadf8600017de333",
    )

    assert payload.image_ids == ["64b7f04beadf8600017de333"]
    assert payload.status == ProductStatus.DRAFT


def test_product_update_rejects_invalid_slug() -> None:
    """Admin payloads should keep product slugs URL-safe."""

    with pytest.raises(ValidationError):
        ProductUpdate(slug="Vestido Invalido")


def test_category_payload_supports_catalog_group_kinds() -> None:
    """Collections and clothing types share the category model."""

    collection = CategoryCreate(
        name="Cayena",
        slug="cayena",
        kind=CatalogGroupKind.COLLECTION,
    )
    update = CategoryUpdate(kind=CatalogGroupKind.CLOTHING_TYPE)

    assert collection.kind == CatalogGroupKind.COLLECTION
    assert update.kind == CatalogGroupKind.CLOTHING_TYPE
