"""Seed the initial ISOLE catalog structure.

The script is idempotent: it upserts catalog groups by slug and creates
products as drafts only when they do not already exist.
"""

import asyncio

from app.core.enums import CatalogGroupKind, ProductStatus
from app.database.database import close_database, connect_database
from app.models.category import Category
from app.models.product import Product
from app.repositories.categories import CategoryRepository
from app.repositories.products import ProductRepository


COLLECTIONS = [
    ("sagi-vitta", "SAGI - VITTA"),
    ("georgiana", "GEORGIANA"),
    ("cayena", "CAYENA"),
    ("unique", "UNIQUE"),
    ("celestial", "CELESTIAL"),
]

CLOTHING_TYPES = [
    ("swimwear", "SWIMWEAR"),
    ("vestidos", "VESTIDOS"),
    ("prendas-superiores", "PRENDAS SUPERIORES"),
    ("prendas-inferiores", "PRENDAS INFERIORES"),
    ("jeans", "JEANS"),
    ("camisetas", "CAMISETAS"),
]

PRODUCTS = [
    ("blusa-vitta", "BLUSA VITTA", "sagi-vitta", None),
    ("falda-dolce-vitta", "FALDA DOLCE VITTA", "sagi-vitta", None),
    ("jean-vitta", "JEAN VITTA", "sagi-vitta", None),
    ("enterizo-noir", "ENTERIZO NOIR", None, "swimwear"),
    ("bikini-atardecer", "BIKINI ATARDECER", None, "swimwear"),
    ("tiara-marfil", "TIARA MARFIL", None, "swimwear"),
    ("cinturilla-georgiana", "CINTURILLA GEORGIANA", "georgiana", None),
    ("vestido-duquesa", "VESTIDO DUQUESA", "georgiana", None),
    ("vestido-encanto-azul", "VESTIDO ENCANTO AZUL", "georgiana", None),
    ("vestido-cayena", "VESTIDO CAYENA", "cayena", None),
    ("maxi-jean-cayena", "MAXI JEAN CAYENA", "cayena", None),
    ("vestido-mono-blanco", "VESTIDO MONO BLANCO", "cayena", None),
    ("vestido-tropical", "VESTIDO TROPICAL", None, "vestidos"),
    ("vestido-floral-negro", "VESTIDO FLORAL NEGRO", None, "vestidos"),
    ("vestido-cereza", "VESTIDO CEREZA", None, "vestidos"),
    ("blusa-tiras-blanca", "BLUSA TIRAS BLANCA", None, "prendas-superiores"),
    ("corset-blonda", "CORSET BLONDA", None, "prendas-superiores"),
    ("top-brillos-negro", "TOP BRILLOS NEGRO", None, "prendas-superiores"),
    ("falda-blanca-denim", "FALDA BLANCA DENIM", None, "prendas-inferiores"),
    ("pantalon-christina", "PANTALON CHRISTINA", None, "prendas-inferiores"),
    ("falda-love", "FALDA LOVE", None, "prendas-inferiores"),
    ("jean-wide-leg-clasico", "JEAN WIDE LEG CLASICO", None, "jeans"),
    ("camiseta-unisex-criollitos", "CAMISETA UNISEX CRIOLLITOS", None, "camisetas"),
    ("pantalon-marfil", "PANTALON MARFIL", "unique", None),
    ("blusa-marfil", "BLUSA MARFIL", "unique", None),
    ("vestido-primaveral-corto", "VESTIDO PRIMAVERAL CORTO", "unique", None),
    ("corset-celestial", "CORSET CELESTIAL", "celestial", None),
    ("falda-celestial", "FALDA CELESTIAL", "celestial", None),
]


async def upsert_group(
    repo: CategoryRepository,
    slug: str,
    name: str,
    kind: CatalogGroupKind,
    sort_order: int,
) -> Category:
    """Create or gently update one catalog group."""

    existing = await repo.get_by_slug(slug)
    if existing is None:
        return await repo.create(
            {
                "slug": slug,
                "name": name,
                "kind": kind,
                "sort_order": sort_order,
                "is_active": True,
            }
        )

    updates = {}
    if existing.kind != kind:
        updates["kind"] = kind
    if existing.sort_order == 0:
        updates["sort_order"] = sort_order
    if not existing.is_active:
        updates["is_active"] = True
    if updates:
        return await repo.update(str(existing.id), updates)
    return existing


async def seed() -> None:
    """Seed groups and draft products."""

    await connect_database()
    try:
        category_repo = CategoryRepository()
        product_repo = ProductRepository()

        group_ids: dict[str, str] = {}
        for index, (slug, name) in enumerate(COLLECTIONS, start=10):
            group = await upsert_group(
                category_repo,
                slug,
                name,
                CatalogGroupKind.COLLECTION,
                index * 10,
            )
            group_ids[slug] = str(group.id)

        for index, (slug, name) in enumerate(CLOTHING_TYPES, start=30):
            group = await upsert_group(
                category_repo,
                slug,
                name,
                CatalogGroupKind.CLOTHING_TYPE,
                index * 10,
            )
            group_ids[slug] = str(group.id)

        created = 0
        updated = 0
        for index, (slug, name, collection_slug, clothing_slug) in enumerate(
            PRODUCTS,
            start=1,
        ):
            collection_ids = [group_ids[collection_slug]] if collection_slug else []
            clothing_type_ids = [group_ids[clothing_slug]] if clothing_slug else []
            existing = await product_repo.get_by_slug(slug)
            if existing is None:
                variants = []
                if slug == "pantalon-christina":
                    variants = [{"color": "Vino"}, {"color": "Cafe"}]
                await product_repo.create(
                    {
                        "slug": slug,
                        "name": name,
                        "status": ProductStatus.DRAFT,
                        "publication_errors": [
                            "Falta una descripcion.",
                            "Falta al menos una imagen.",
                        ],
                        "collection_ids": collection_ids,
                        "clothing_type_ids": clothing_type_ids,
                        "variants": variants,
                        "sort_order": index * 10,
                        "is_active": True,
                    }
                )
                created += 1
                continue

            updates = {}
            if not existing.collection_ids and collection_ids:
                updates["collection_ids"] = collection_ids
            if not existing.clothing_type_ids and clothing_type_ids:
                updates["clothing_type_ids"] = clothing_type_ids
            if existing.sort_order == 0:
                updates["sort_order"] = index * 10
            if updates:
                await product_repo.update(str(existing.id), updates)
                updated += 1

        print(
            "Catalog seed completed: "
            f"{len(COLLECTIONS)} collections, {len(CLOTHING_TYPES)} clothing types, "
            f"{created} products created, {updated} products updated."
        )
    finally:
        await close_database()


if __name__ == "__main__":
    asyncio.run(seed())
