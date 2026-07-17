import type { MetadataRoute } from 'next'
import { products } from '@/lib/products'
import { absoluteUrl } from '@/lib/site'
import { productPath } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...products.map((product) => ({
      url: absoluteUrl(productPath(product)),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
