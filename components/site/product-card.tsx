import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/products'

export function ProductCard({
  product,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: {
  product: Product
  sizes?: string
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${product.category}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
        <Image
          src={product.product || '/placeholder.svg'}
          alt={`${product.name} - vista de producto`}
          fill
          sizes={sizes}
          className="object-cover transition-opacity duration-[900ms] ease-luxe group-hover:opacity-0"
        />
        <Image
          src={product.model || '/placeholder.svg'}
          alt={`${product.name} - vista en modelo`}
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-all duration-[900ms] ease-luxe group-hover:scale-105 group-hover:opacity-100"
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/85 px-3 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
          Disponible en tienda
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl text-ink">{product.name}</h3>
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-500 group-hover:text-coral">
          {product.category}
        </span>
      </div>
    </Link>
  )
}
