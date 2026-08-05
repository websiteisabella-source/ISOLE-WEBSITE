import Image from 'next/image'
import Link from 'next/link'
import {
  getProductCollectionName,
  hasVerifiedProductMedia,
  type Product,
} from '@/lib/products'
import { ComingSoonArtwork } from './coming-soon-artwork'

type FeaturedCollectionBlockProps = {
  title: string
  href: string
  products: Product[]
  imageOverrides?: Record<string, string>
}

export function FeaturedCollectionBlock({
  title,
  href,
  products,
  imageOverrides = {},
}: FeaturedCollectionBlockProps) {
  return (
    <section className="featured-collection-block">
      <div className="featured-collection-header">
        <h2 className="featured-collection-heading">{title}</h2>
        <Link href={href} className="featured-collection-link">
          Ver todo
        </Link>
      </div>

      <div className="featured-collection-grid">
        {products.map((product) => {
          const image = imageOverrides[product.slug]
          const hasProductMedia = Boolean(image) || hasVerifiedProductMedia(product)
          const productImage = image || product.model || product.product || '/placeholder.svg'

          return (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="featured-collection-product group"
              aria-label={`${product.name}, ${product.category}`}
            >
              <div className="featured-collection-image">
                {hasProductMedia ? (
                  <Image
                    src={productImage}
                    alt={`${product.name} - vista editorial`}
                    fill
                    sizes="(max-width: 767px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
                  />
                ) : (
                  <ComingSoonArtwork
                    label={getProductCollectionName(product)}
                    className="px-4"
                  />
                )}
              </div>
              <h3 className="featured-collection-name">{product.name}</h3>
              <p className="featured-collection-meta">
                {hasProductMedia ? 'Disponible en tienda' : 'Próximamente'}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
