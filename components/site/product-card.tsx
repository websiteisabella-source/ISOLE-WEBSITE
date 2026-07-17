import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import { HeartSunIcon } from './icons'

export function ProductCard({
  product,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  product: Product
  sizes?: string
}) {
  const productImage = product.product || product.model || '/placeholder.svg'
  const modelImage = product.model || product.product || '/placeholder.svg'
  const hasProductMedia = Boolean(product.product || product.model)

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${product.category}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
        {hasProductMedia ? (
          <>
            <Image
              src={productImage}
              alt={`${product.name} - vista de producto`}
              fill
              sizes={sizes}
              className="object-cover transition-opacity duration-[900ms] ease-luxe group-hover:opacity-0"
            />
            <Image
              src={modelImage}
              alt={`${product.name} - vista en modelo`}
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-all duration-[900ms] ease-luxe group-hover:scale-105 group-hover:opacity-100"
            />
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-nude/70 px-8 text-center transition-colors duration-[900ms] ease-luxe group-hover:bg-petal/45">
            <HeartSunIcon className="size-14 text-coral" />
            <span className="mt-8 text-[0.62rem] uppercase tracking-luxe text-coral">
              {product.category}
            </span>
            <span className="brand-subtitle mt-3 text-4xl text-ink">
              Próximamente
            </span>
          </div>
        )}
        {(product.description || product.fabric || product.colors?.length) && (
          <span className="absolute left-4 top-4 rounded-full bg-cream/85 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
            Disponible en tienda
          </span>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl leading-[1.25] text-ink">
          {product.name}
        </h3>
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-500 group-hover:text-coral">
          {product.category}
        </span>
      </div>
    </Link>
  )
}
