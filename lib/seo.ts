import { cloudinaryImage } from './cloudinary-assets'
import type { Product } from './products'
import {
  absoluteUrl,
  INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
  WHATSAPP_NUMBER,
} from './site'

export const HOME_TITLE =
  'ISOLÉ | Ropa femenina natural, vestidos de lino y blusas de seda'

export const HOME_DESCRIPTION =
  'Descubre ISOLÉ, showroom de moda femenina con vestidos de lino, blusas de seda y piezas naturales en cantidades limitadas. Consulta disponibilidad por WhatsApp.'

export const HOME_KEYWORDS = [
  'comprar ropa femenina',
  'vestidos de lino',
  'blusas de seda',
  'showroom de ropa femenina',
  'ropa natural para mujer',
  'moda femenina elegante',
  'ropa romantica para mujer',
  'ISOLÉ',
]

export const OG_IMAGE = cloudinaryImage('/images/hero.png')
export const LOGO_IMAGE = cloudinaryImage('/images/isole-logo-wordmark.png')

export function productPath(product: Product) {
  return `/product/${product.slug}`
}

export function productUrl(product: Product) {
  return absoluteUrl(productPath(product))
}

export function productSeoTitle(product: Product) {
  return `${product.name} | ${product.category} para mujer | Comprar ropa femenina`
}

export function productSeoDescription(product: Product) {
  return `${product.description} Disponible en showroom ISOLÉ. Consulta colores, tejido y disponibilidad por WhatsApp.`
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ClothingStore'],
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_IMAGE,
  image: OG_IMAGE,
  description: HOME_DESCRIPTION,
  sameAs: [INSTAGRAM_URL],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: `+${WHATSAPP_NUMBER}`,
    contactType: 'customer service',
    availableLanguage: ['es'],
  },
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'es',
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
  },
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: productSeoDescription(product),
    image: product.gallery,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: product.category,
    material: product.fabric,
    color: product.colors,
    url: productUrl(product),
  }
}

export function breadcrumbJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Novedades',
        item: absoluteUrl('/#novedades'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: productUrl(product),
      },
    ],
  }
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }
}
