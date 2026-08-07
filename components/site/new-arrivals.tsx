import { FeaturedCollectionBlock } from './featured-collection-block'
import { VittaStoryCarousel } from './vitta-story-carousel'
import { getActiveProducts } from '@/lib/products'

export function NewArrivals() {
  const vittaProducts = getActiveProducts().filter((product) =>
    ['blusa-vitta', 'falda-dolce-vitta', 'jean-vitta'].includes(product.slug),
  )

  return (
    <section id="novedades" className="featured-collection-sequence">
      <VittaStoryCarousel />

      <FeaturedCollectionBlock
        title="Vitta"
        href="/catalogo/vitta"
        products={vittaProducts}
        presentation="carousel"
      />
    </section>
  )
}
