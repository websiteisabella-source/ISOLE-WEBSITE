import { FeaturedCollectionBlock } from './featured-collection-block'
import { getActiveProducts } from '@/lib/products'

export function MasonryGallery() {
  const products = getActiveProducts().filter((product) =>
    ['vestido-atardecer', 'blusa-seda-alba', 'slip-petalo'].includes(
      product.slug,
    ),
  )

  return (
    <div id="colecciones" style={{ scrollMarginTop: '7rem' }}>
      <FeaturedCollectionBlock
        title="Crisálida"
        href="/catalogo/crisalida"
        products={products}
      />
    </div>
  )
}
