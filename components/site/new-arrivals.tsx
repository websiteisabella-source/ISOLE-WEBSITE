import Link from 'next/link'
import { ProductCard } from './product-card'
import { Reveal } from './reveal'
import { getActiveProducts } from '@/lib/products'

export function NewArrivals() {
  const featuredProducts = getActiveProducts()
    .filter((product) => product.product || product.model)
    .slice(0, 3)

  return (
    <section
      id="novedades"
      className="px-5 pt-16 pb-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 text-center">
          <span className="text-[0.7rem] uppercase tracking-luxe text-coral">
            Recién llegado
          </span>
          <h2 className="editorial-title mx-auto mt-4 max-w-2xl text-balance text-4xl text-ink md:text-6xl">
            Las piezas que estrenan la estación
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Pasa el cursor sobre cada pieza para verla cobrar vida. Todas
            disponibles para descubrir en nuestro showroom.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-7">
          {featuredProducts.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.12}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/catalogo/todos-los-articulos"
            className="inline-flex items-center justify-center rounded-full border border-coral px-8 py-4 text-xs font-medium uppercase tracking-[0.18em] text-coral transition-all duration-500 ease-luxe hover:bg-coral hover:text-primary-foreground"
          >
            Explorar catálogo completo
          </Link>
        </div>
      </div>
    </section>
  )
}
