import { cloudinaryImage } from './cloudinary-assets'

export type Product = {
  slug: string
  name: string
  category: string
  description: string
  fabric: string
  colors: string[]
  product: string
  model: string
  gallery: string[]
}

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
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}
