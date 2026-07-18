'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { HeartSunIcon } from '@/components/site/icons'
import type { CatalogGroupType } from '@/lib/products'

type ApiEnvelope<T> = {
  success: boolean
  data: T
}

type ApiProduct = {
  id: string
  name: string
  slug: string
  short_description?: string | null
  description?: string | null
  price?: number | null
  currency: string
  collection_ids: string[]
  clothing_type_ids: string[]
  image_ids: string[]
  primary_image_id?: string | null
}

type ApiGroup = {
  id: string
  name: string
  slug: string
  kind: 'collection' | 'clothing_type'
}

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000'

export function LiveCatalogProducts({
  currentSlug,
  groupType,
  staticSlugs,
  children,
}: {
  currentSlug: string
  groupType: CatalogGroupType
  staticSlugs: string[]
  children: ReactNode
}) {
  const [products, setProducts] = useState<ApiProduct[] | null>(null)
  const [groups, setGroups] = useState<ApiGroup[]>([])

  const staticSlugSet = useMemo(() => new Set(staticSlugs), [staticSlugs])

  useEffect(() => {
    let cancelled = false

    async function loadLiveCatalog() {
      try {
        const groupResponse = await fetch(`${apiBase}/api/v1/categories?page_size=100`)
        if (!groupResponse.ok) return
        const groupPayload = (await groupResponse.json()) as ApiEnvelope<{
          items: ApiGroup[]
        }>
        if (!groupPayload.success) return

        const currentGroup = groupPayload.data.items.find((group) => group.slug === currentSlug)
        const params = new URLSearchParams({ page_size: '100' })
        if (groupType !== 'aggregate' && !currentGroup) {
          return
        }
        if (groupType !== 'aggregate' && currentGroup) {
          params.set('category_id', currentGroup.id)
        }

        const productResponse = await fetch(`${apiBase}/api/v1/products?${params}`)
        if (!productResponse.ok) return
        const productPayload = (await productResponse.json()) as ApiEnvelope<{
          items: ApiProduct[]
        }>
        if (!productPayload.success || cancelled) return

        setGroups(groupPayload.data.items)
        setProducts(productPayload.data.items)
      } catch {
        if (!cancelled) setProducts(null)
      }
    }

    void loadLiveCatalog()

    return () => {
      cancelled = true
    }
  }, [currentSlug, groupType])

  if (!products || products.length === 0) {
    return <>{children}</>
  }

  return (
    <section className="mt-16">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.68rem] uppercase tracking-luxe text-coral">
            Actualizado desde admin
          </span>
          <h2 className="editorial-title mt-3 text-4xl text-ink md:text-5xl">
            Catálogo publicado
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? 'artículo' : 'artículos'}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-7">
        {products.map((product) => (
          <LiveProductCard
            key={product.id}
            product={product}
            groups={groups}
            canLink={staticSlugSet.has(product.slug)}
          />
        ))}
      </div>
    </section>
  )
}

function LiveProductCard({
  product,
  groups,
  canLink,
}: {
  product: ApiProduct
  groups: ApiGroup[]
  canLink: boolean
}) {
  const category = groups.find((group) =>
    [...product.collection_ids, ...product.clothing_type_ids].includes(group.id),
  )
  const content = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
        <div className="flex size-full flex-col items-center justify-center bg-nude/70 px-8 text-center transition-colors duration-[900ms] ease-luxe hover:bg-petal/45">
          <HeartSunIcon className="size-14 text-coral" />
          <span className="mt-8 text-[0.62rem] uppercase tracking-luxe text-coral">
            {category?.name ?? 'ISOLE'}
          </span>
          <span className="brand-subtitle mt-3 text-4xl text-ink">
            {product.image_ids.length > 0 ? 'Disponible' : 'Próximamente'}
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl leading-[1.25] text-ink">{product.name}</h3>
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          {category?.name ?? 'Catálogo'}
        </span>
      </div>
      {product.short_description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>
      )}
    </>
  )

  if (!canLink) {
    return <article>{content}</article>
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {content}
    </Link>
  )
}
