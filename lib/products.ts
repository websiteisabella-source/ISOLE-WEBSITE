import { cloudinaryImage } from './cloudinary-assets'

export type ProductVariant = {
  color: string
}

export type Product = {
  slug: string
  name: string
  category: string
  description?: string
  fabric?: string
  colors?: string[]
  product?: string
  model?: string
  gallery?: string[]
  variants?: ProductVariant[]
  isActive?: boolean
}

export type CatalogGroupType = 'collection' | 'category' | 'aggregate'

export type CatalogGroup = {
  slug: string
  name: string
  type: CatalogGroupType
  productSlugs?: string[]
}

export const catalogGroups: CatalogGroup[] = [
  {
    slug: 'sagi-vitta',
    name: 'SAGI - VITTA',
    type: 'collection',
    productSlugs: ['blusa-vitta', 'falda-dolce-vitta', 'jean-vitta'],
  },
  {
    slug: 'swimwear',
    name: 'SWIMWEAR',
    type: 'category',
    productSlugs: ['enterizo-noir', 'bikini-atardecer', 'tiara-marfil'],
  },
  {
    slug: 'georgiana',
    name: 'GEORGIANA',
    type: 'collection',
    productSlugs: [
      'cinturilla-georgiana',
      'vestido-duquesa',
      'vestido-encanto-azul',
    ],
  },
  {
    slug: 'cayena',
    name: 'CAYENA',
    type: 'collection',
    productSlugs: ['vestido-cayena', 'maxi-jean-cayena', 'vestido-mono-blanco'],
  },
  {
    slug: 'vestidos',
    name: 'VESTIDOS',
    type: 'category',
    productSlugs: ['vestido-tropical', 'vestido-floral-negro', 'vestido-cereza'],
  },
  {
    slug: 'prendas-superiores',
    name: 'PRENDAS SUPERIORES',
    type: 'category',
    productSlugs: ['blusa-tiras-blanca', 'corset-blonda', 'top-brillos-negro'],
  },
  {
    slug: 'prendas-inferiores',
    name: 'PRENDAS INFERIORES',
    type: 'category',
    productSlugs: ['falda-blanca-denim', 'pantalon-christina', 'falda-love'],
  },
  {
    slug: 'jeans',
    name: 'JEANS',
    type: 'category',
    productSlugs: ['jean-wide-leg-clasico'],
  },
  {
    slug: 'camisetas',
    name: 'CAMISETAS',
    type: 'category',
    productSlugs: ['camiseta-unisex-criollitos'],
  },
  {
    slug: 'unique',
    name: 'UNIQUE',
    type: 'collection',
    productSlugs: ['pantalon-marfil', 'blusa-marfil', 'vestido-primaveral-corto'],
  },
  {
    slug: 'celestial',
    name: 'CELESTIAL',
    type: 'collection',
    productSlugs: ['corset-celestial', 'falda-celestial'],
  },
  {
    slug: 'todos-los-articulos',
    name: 'TODOS LOS ARTÍCULOS',
    type: 'aggregate',
  },
]

export const products: Product[] = [
  {
    slug: 'vestido-atardecer',
    name: 'Vestido Atardecer',
    category: 'Vestidos',
    description:
      'Un vestido de lino que cae como la última luz de la tarde. Pensado para moverse con el viento y abrazar el cuerpo sin pedir permiso.',
    fabric: 'Lino 100% natural',
    colors: ['Atardecer Coral', 'Nude'],
    product: cloudinaryImage('/images/arrival-1-product.png'),
    model: cloudinaryImage('/images/arrival-1-model.png'),
    gallery: [
      cloudinaryImage('/images/arrival-1-model.png'),
      cloudinaryImage('/images/detail-back.png'),
      cloudinaryImage('/images/detail-texture.png'),
      cloudinaryImage('/images/detail-lifestyle.png'),
    ],
  },
  {
    slug: 'blusa-seda-alba',
    name: 'Blusa Seda Alba',
    category: 'Blusas',
    description:
      'La calma de la mañana hecha prenda. Una blusa de seda que se desliza sobre la piel con una elegancia silenciosa y atemporal.',
    fabric: 'Seda lavada',
    colors: ['Crema', 'Pétalo Rosa'],
    product: cloudinaryImage('/images/arrival-2-product.png'),
    model: cloudinaryImage('/images/arrival-2-model.png'),
    gallery: [
      cloudinaryImage('/images/arrival-2-model.png'),
      cloudinaryImage('/images/arrival-2-product.png'),
      cloudinaryImage('/images/editorial-story.png'),
    ],
  },
  {
    slug: 'slip-petalo',
    name: 'Slip Pétalo',
    category: 'Vestidos',
    description:
      'Un slip dress de satén en tono pétalo, romántico y desnudo. Hecho para las noches cálidas y los momentos que se quedan.',
    fabric: 'Satén de viscosa',
    colors: ['Pétalo Rosa', 'Lavanda Viva'],
    product: cloudinaryImage('/images/arrival-3-product.png'),
    model: cloudinaryImage('/images/arrival-3-model.png'),
    gallery: [
      cloudinaryImage('/images/arrival-3-model.png'),
      cloudinaryImage('/images/collection-3.png'),
      cloudinaryImage('/images/collection-4.png'),
    ],
  },
  { slug: 'blusa-vitta', name: 'BLUSA VITTA', category: 'SAGI - VITTA' },
  {
    slug: 'falda-dolce-vitta',
    name: 'FALDA DOLCE VITTA',
    category: 'SAGI - VITTA',
  },
  { slug: 'jean-vitta', name: 'JEAN VITTA', category: 'SAGI - VITTA' },
  { slug: 'enterizo-noir', name: 'ENTERIZO NOIR', category: 'SWIMWEAR' },
  { slug: 'bikini-atardecer', name: 'BIKINI ATARDECER', category: 'SWIMWEAR' },
  { slug: 'tiara-marfil', name: 'TIARA MARFIL', category: 'SWIMWEAR' },
  {
    slug: 'cinturilla-georgiana',
    name: 'CINTURILLA GEORGIANA',
    category: 'GEORGIANA',
  },
  { slug: 'vestido-duquesa', name: 'VESTIDO DUQUESA', category: 'GEORGIANA' },
  {
    slug: 'vestido-encanto-azul',
    name: 'VESTIDO ENCANTO AZUL',
    category: 'GEORGIANA',
  },
  { slug: 'vestido-cayena', name: 'VESTIDO CAYENA', category: 'CAYENA' },
  { slug: 'maxi-jean-cayena', name: 'MAXI JEAN CAYENA', category: 'CAYENA' },
  {
    slug: 'vestido-mono-blanco',
    name: 'VESTIDO MOÑO BLANCO',
    category: 'CAYENA',
  },
  { slug: 'vestido-tropical', name: 'VESTIDO TROPICAL', category: 'VESTIDOS' },
  {
    slug: 'vestido-floral-negro',
    name: 'VESTIDO FLORAL NEGRO',
    category: 'VESTIDOS',
  },
  { slug: 'vestido-cereza', name: 'VESTIDO CEREZA', category: 'VESTIDOS' },
  {
    slug: 'blusa-tiras-blanca',
    name: 'BLUSA TIRAS BLANCA',
    category: 'PRENDAS SUPERIORES',
  },
  {
    slug: 'corset-blonda',
    name: 'CORSET BLONDA',
    category: 'PRENDAS SUPERIORES',
  },
  {
    slug: 'top-brillos-negro',
    name: 'TOP BRILLOS NEGRO',
    category: 'PRENDAS SUPERIORES',
  },
  {
    slug: 'falda-blanca-denim',
    name: 'FALDA BLANCA DENIM',
    category: 'PRENDAS INFERIORES',
  },
  {
    slug: 'pantalon-christina',
    name: 'PANTALÓN CHRISTINA',
    category: 'PRENDAS INFERIORES',
    colors: ['Vino', 'Café'],
    variants: [{ color: 'Vino' }, { color: 'Café' }],
  },
  {
    slug: 'falda-love',
    name: 'FALDA LOVE',
    category: 'PRENDAS INFERIORES',
  },
  {
    slug: 'jean-wide-leg-clasico',
    name: 'JEAN WIDE LEG CLÁSICO',
    category: 'JEANS',
  },
  {
    slug: 'camiseta-unisex-criollitos',
    name: 'CAMISETA UNISEX CRIOLLITOS',
    category: 'CAMISETAS',
  },
  { slug: 'pantalon-marfil', name: 'PANTALÓN MARFIL', category: 'UNIQUE' },
  { slug: 'blusa-marfil', name: 'BLUSA MARFIL', category: 'UNIQUE' },
  {
    slug: 'vestido-primaveral-corto',
    name: 'VESTIDO PRIMAVERAL CORTO',
    category: 'UNIQUE',
  },
  {
    slug: 'corset-celestial',
    name: 'CORSET CELESTIAL',
    category: 'CELESTIAL',
  },
  {
    slug: 'falda-celestial',
    name: 'FALDA CELESTIAL',
    category: 'CELESTIAL',
  },
]

export function getActiveProducts() {
  return products.filter((product) => product.isActive !== false)
}

export function getProduct(slug: string) {
  return getActiveProducts().find((product) => product.slug === slug)
}

export function getCatalogGroup(slug: string) {
  return catalogGroups.find((group) => group.slug === slug)
}

export function getCatalogProducts(group: CatalogGroup) {
  if (group.type === 'aggregate') {
    return uniqueProducts(getActiveProducts())
  }

  const productBySlug = new Map(
    getActiveProducts().map((product) => [product.slug, product]),
  )

  return uniqueProducts(
    (group.productSlugs ?? [])
      .map((slug) => productBySlug.get(slug))
      .filter((product): product is Product => Boolean(product)),
  )
}

export function getProductImages(product: Product) {
  const images = [
    ...(product.gallery ?? []),
    product.model,
    product.product,
  ].filter((image): image is string => Boolean(image))

  return images.length > 0 ? uniqueValues(images) : ['/placeholder.svg']
}

export function getRelatedProducts(product: Product) {
  const group = catalogGroups.find((catalogGroup) =>
    catalogGroup.productSlugs?.includes(product.slug),
  )
  const pool = group ? getCatalogProducts(group) : getActiveProducts()

  return pool
    .filter((relatedProduct) => relatedProduct.slug !== product.slug)
    .slice(0, 4)
}

function uniqueProducts(items: Product[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.slug)) {
      return false
    }

    seen.add(item.slug)
    return true
  })
}

function uniqueValues(items: string[]) {
  return [...new Set(items)]
}
