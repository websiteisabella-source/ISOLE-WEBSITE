"""Seed the initial ISOLE catalog structure.

The script is idempotent: it upserts catalog groups by slug and creates
products as drafts only when they do not already exist.
"""

import asyncio

from app.core.enums import CatalogGroupKind, ProductStatus
from app.database.database import close_database, connect_database
from app.models.category import Category
from app.repositories.categories import CategoryRepository
from app.repositories.products import ProductRepository

COLLECTIONS = [
    (
        "sagi-vitta",
        "SAGI - VITTA",
        "Piezas serenas y contemporaneas para explorar una identidad femenina clara.",
    ),
    (
        "georgiana",
        "GEORGIANA",
        "Una coleccion de presencia expresiva para looks con acentos definidos.",
    ),
    ("cayena", "CAYENA", "Piezas calidas y decididas para combinar con naturalidad e intencion."),
    ("unique", "UNIQUE", "Prendas de lectura limpia y expresiva para combinaciones sencillas."),
    (
        "celestial",
        "CELESTIAL",
        "Piezas delicadas y afirmativas conectadas con la idea de luz interior.",
    ),
]

CLOTHING_TYPES = [
    (
        "swimwear",
        "SWIMWEAR",
        "Piezas de bano y complementos para momentos de sol, descanso y movimiento.",
    ),
    (
        "vestidos",
        "VESTIDOS",
        "Propuestas para llevar como protagonistas del look en diferentes momentos.",
    ),
    (
        "prendas-superiores",
        "PRENDAS SUPERIORES",
        "Blusas, corsets y tops para construir combinaciones con capas y contraste.",
    ),
    (
        "prendas-inferiores",
        "PRENDAS INFERIORES",
        "Faldas, pantalones y jeans que sostienen el look desde la forma y el color.",
    ),
    ("jeans", "JEANS", "Piezas versatiles para acompanar el dia a dia con naturalidad."),
    (
        "camisetas",
        "CAMISETAS",
        "Prendas de lectura comoda y directa para combinaciones cotidianas.",
    ),
]

PRODUCTS = [
    (
        "blusa-vitta",
        "BLUSA VITTA",
        "sagi-vitta",
        None,
        "Blusa de la coleccion SAGI - VITTA para combinaciones serenas.",
        "Pieza superior de SAGI - VITTA para looks limpios, femeninos y actuales.",
    ),
    (
        "falda-dolce-vitta",
        "FALDA DOLCE VITTA",
        "sagi-vitta",
        None,
        "Falda de SAGI - VITTA para looks con lectura femenina y actual.",
        "Prenda inferior de SAGI - VITTA para combinar con piezas de la linea.",
    ),
    (
        "jean-vitta",
        "JEAN VITTA",
        "sagi-vitta",
        None,
        "Jean de SAGI - VITTA para acompanar piezas superiores del showroom.",
        "Prenda inferior versatil de SAGI - VITTA para combinaciones relajadas.",
    ),
    (
        "enterizo-noir",
        "ENTERIZO NOIR",
        None,
        "swimwear",
        "Enterizo de bano en Swimwear con presencia sobria y reconocible.",
        "Pieza principal de Swimwear para momentos de sol y descanso.",
    ),
    (
        "bikini-atardecer",
        "BIKINI ATARDECER",
        None,
        "swimwear",
        "Bikini de espiritu calido para explorar la categoria Swimwear.",
        "Pieza de bano conectada con luz, color y expresion.",
    ),
    (
        "tiara-marfil",
        "TIARA MARFIL",
        None,
        "swimwear",
        "Complemento Swimwear para sumar un acento claro a looks de verano.",
        "Pieza de apoyo dentro de Swimwear con una nota luminosa.",
    ),
    (
        "cinturilla-georgiana",
        "CINTURILLA GEORGIANA",
        "georgiana",
        None,
        "Pieza de GEORGIANA para sumar un acento definido al look.",
        "Pieza de acento de GEORGIANA para combinaciones con intencion visual.",
    ),
    (
        "vestido-duquesa",
        "VESTIDO DUQUESA",
        "georgiana",
        None,
        "Vestido GEORGIANA con presencia femenina, expresiva y ceremonial.",
        "Vestido de GEORGIANA para ocupar el centro del look con presencia.",
    ),
    (
        "vestido-encanto-azul",
        "VESTIDO ENCANTO AZUL",
        "georgiana",
        None,
        "Vestido GEORGIANA con identidad cromatica clara e intencion expresiva.",
        "Pieza de GEORGIANA con una lectura cromatica distintiva.",
    ),
    (
        "vestido-cayena",
        "VESTIDO CAYENA",
        "cayena",
        None,
        "Vestido CAYENA para looks calidos, presentes y reconocibles.",
        "Pieza protagonista de CAYENA, calida y decidida.",
    ),
    (
        "maxi-jean-cayena",
        "MAXI JEAN CAYENA",
        "cayena",
        None,
        "Jean CAYENA para combinaciones con una base marcada y actual.",
        "Prenda inferior de CAYENA para combinar con tops o blusas.",
    ),
    (
        "vestido-mono-blanco",
        "VESTIDO MOÑO BLANCO",
        "cayena",
        None,
        "Vestido CAYENA con lectura clara, femenina y delicada.",
        "Pieza de CAYENA para combinaciones suaves o de contraste.",
    ),
    (
        "vestido-tropical",
        "VESTIDO TROPICAL",
        None,
        "vestidos",
        "Vestido para looks de clima calido y expresion natural.",
        "Propuesta de Vestidos con lectura fresca para momentos de luz.",
    ),
    (
        "vestido-floral-negro",
        "VESTIDO FLORAL NEGRO",
        None,
        "vestidos",
        "Vestido floral negro para una presencia visual definida.",
        "Pieza de Vestidos con referencia floral y base cromatica sobria.",
    ),
    (
        "vestido-cereza",
        "VESTIDO CEREZA",
        None,
        "vestidos",
        "Vestido de nombre vibrante para llevar color al centro del look.",
        "Pieza de Vestidos con energia expresiva y femenina.",
    ),
    (
        "blusa-tiras-blanca",
        "BLUSA TIRAS BLANCA",
        None,
        "prendas-superiores",
        "Blusa blanca de tiras para combinaciones claras y frescas.",
        "Pieza superior de lectura limpia para combinar con faldas o jeans.",
    ),
    (
        "corset-blonda",
        "CORSET BLONDA",
        None,
        "prendas-superiores",
        "Corset para looks con una intencion mas marcada.",
        "Pieza superior de caracter definido para looks con intencion.",
    ),
    (
        "top-brillos-negro",
        "TOP BRILLOS NEGRO",
        None,
        "prendas-superiores",
        "Top negro con referencia de brillo para combinaciones de contraste.",
        "Pieza superior de lectura intensa para looks sobrios o expresivos.",
    ),
    (
        "falda-blanca-denim",
        "FALDA BLANCA DENIM",
        None,
        "prendas-inferiores",
        "Falda blanca denim para looks claros y actuales.",
        "Prenda inferior directa y facil de combinar con blusas, tops o camisetas del catalogo.",
    ),
    (
        "pantalon-christina",
        "PANTALÓN CHRISTINA",
        None,
        "prendas-inferiores",
        "Pantalon disponible en Vino y Cafe para combinaciones calidas.",
        "Prenda inferior con variantes de color Vino y Cafe registradas.",
    ),
    (
        "falda-love",
        "FALDA LOVE",
        None,
        "prendas-inferiores",
        "Falda de nombre expresivo para looks femeninos y cercanos.",
        "Pieza inferior de tono emocional para combinaciones suaves.",
    ),
    (
        "jean-wide-leg-clasico",
        "JEAN WIDE LEG CLÁSICO",
        None,
        "jeans",
        "Jean wide leg clasico para combinaciones cotidianas.",
        "Pieza de Jeans para acompanar blusas, camisetas o tops.",
    ),
    (
        "camiseta-unisex-criollitos",
        "CAMISETA UNISEX CRIOLLITOS",
        None,
        "camisetas",
        "Camiseta unisex para looks cotidianos con identidad cercana.",
        "Propuesta directa para combinar con jeans, faldas o prendas inferiores.",
    ),
    (
        "pantalon-marfil",
        "PANTALÓN MARFIL",
        "unique",
        None,
        "Pantalon UNIQUE con lectura clara, suave y combinable.",
        "Base de color claro de UNIQUE para blusas, tops o contrastes.",
    ),
    (
        "blusa-marfil",
        "BLUSA MARFIL",
        "unique",
        None,
        "Blusa UNIQUE para combinaciones luminosas y sencillas.",
        "Pieza superior clara de UNIQUE para distintas composiciones.",
    ),
    (
        "vestido-primaveral-corto",
        "VESTIDO PRIMAVERAL CORTO",
        "unique",
        None,
        "Vestido corto UNIQUE de espiritu fresco y primaveral.",
        "Pieza de lectura fresca para momentos de dia o clima calido.",
    ),
    (
        "corset-celestial",
        "CORSET CELESTIAL",
        "celestial",
        None,
        "Corset CELESTIAL para looks delicados y definidos.",
        "Pieza superior de CELESTIAL conectada con la idea de luz interior.",
    ),
    (
        "falda-celestial",
        "FALDA CELESTIAL",
        "celestial",
        None,
        "Falda CELESTIAL para composiciones suaves con presencia propia.",
        "Prenda inferior de CELESTIAL para combinar con piezas superiores.",
    ),
]


async def upsert_group(
    repo: CategoryRepository,
    slug: str,
    name: str,
    kind: CatalogGroupKind,
    sort_order: int,
    description: str,
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
                "description": description,
                "is_active": True,
            }
        )

    updates = {}
    if existing.kind != kind:
        updates["kind"] = kind
    if existing.sort_order == 0:
        updates["sort_order"] = sort_order
    if not existing.description:
        updates["description"] = description
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
        for index, (slug, name, description) in enumerate(COLLECTIONS, start=10):
            group = await upsert_group(
                category_repo,
                slug,
                name,
                CatalogGroupKind.COLLECTION,
                index * 10,
                description,
            )
            group_ids[slug] = str(group.id)

        for index, (slug, name, description) in enumerate(CLOTHING_TYPES, start=30):
            group = await upsert_group(
                category_repo,
                slug,
                name,
                CatalogGroupKind.CLOTHING_TYPE,
                index * 10,
                description,
            )
            group_ids[slug] = str(group.id)

        created = 0
        updated = 0
        for index, (
            slug,
            name,
            collection_slug,
            clothing_slug,
            short_description,
            description,
        ) in enumerate(
            PRODUCTS,
            start=1,
        ):
            collection_ids = [group_ids[collection_slug]] if collection_slug else []
            clothing_type_ids = [group_ids[clothing_slug]] if clothing_slug else []
            existing = await product_repo.get_by_slug(slug)
            if existing is None:
                variants = []
                if slug == "pantalon-christina":
                    variants = [{"color": "Vino"}, {"color": "Café"}]
                await product_repo.create(
                    {
                        "slug": slug,
                        "name": name,
                        "short_description": short_description,
                        "description": description,
                        "status": ProductStatus.DRAFT,
                        "publication_errors": [
                            "Falta una descripción.",
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
            if not existing.short_description:
                updates["short_description"] = short_description
            if not existing.description:
                updates["description"] = description
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
