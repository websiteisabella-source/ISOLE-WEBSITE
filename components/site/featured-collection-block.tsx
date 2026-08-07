'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getProductCollectionName,
  hasVerifiedProductMedia,
  type Product,
} from '@/lib/products'
import { ArrowIcon } from './icons'
import { ComingSoonArtwork } from './coming-soon-artwork'

type FeaturedCollectionBlockProps = {
  title: string
  href: string
  products: Product[]
  imageOverrides?: Record<string, string>
  presentation?: 'grid' | 'carousel'
}

export function FeaturedCollectionBlock({
  title,
  href,
  products,
  imageOverrides = {},
  presentation = 'grid',
}: FeaturedCollectionBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(2)
  const trackRef = useRef<HTMLDivElement>(null)
  const isCarousel = presentation === 'carousel' && products.length > 1
  const pageCount = Math.ceil(products.length / itemsPerPage)
  const carouselId = useMemo(
    () =>
      `featured-${title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}`,
    [title],
  )

  const scrollToPage = useCallback((index: number) => {
    const track = trackRef.current
    const targetIndex = index * itemsPerPage
    const target = track?.children.item(targetIndex) as HTMLElement | null

    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }, [itemsPerPage])

  useEffect(() => {
    if (!isCarousel) {
      return
    }

    const updateItemsPerPage = () => {
      setItemsPerPage(window.matchMedia('(min-width: 768px)').matches ? 4 : 2)
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)

    return () => {
      window.removeEventListener('resize', updateItemsPerPage)
    }
  }, [isCarousel])

  useEffect(() => {
    if (!isCarousel) {
      return
    }

    setActiveIndex((currentIndex) => Math.min(currentIndex, pageCount - 1))
  }, [isCarousel, pageCount])

  useEffect(() => {
    if (!isCarousel) {
      return
    }

    const track = trackRef.current
    if (!track) {
      return
    }

    const updateActiveProduct = () => {
      const trackLeft = track.getBoundingClientRect().left
      const distances = Array.from(track.children).map((child) =>
        Math.abs(
          (child as HTMLElement).getBoundingClientRect().left - trackLeft,
        ),
      )
      const nextIndex = distances.indexOf(Math.min(...distances))

      if (nextIndex >= 0) {
        setActiveIndex(Math.floor(nextIndex / itemsPerPage))
      }
    }

    updateActiveProduct()
    track.addEventListener('scroll', updateActiveProduct, { passive: true })
    window.addEventListener('resize', updateActiveProduct)

    return () => {
      track.removeEventListener('scroll', updateActiveProduct)
      window.removeEventListener('resize', updateActiveProduct)
    }
  }, [isCarousel, itemsPerPage])

  return (
    <section
      className={`featured-collection-block ${
        isCarousel ? 'featured-collection-block--carousel' : ''
      }`}
      aria-labelledby={`${carouselId}-heading`}
    >
      <div className="featured-collection-header">
        <h2 id={`${carouselId}-heading`} className="featured-collection-heading">
          {title}
        </h2>
        <Link href={href} className="featured-collection-link">
          Ver todo
        </Link>
      </div>

      <div
        ref={trackRef}
        className={
          isCarousel
            ? 'featured-collection-carousel'
            : 'featured-collection-grid'
        }
        aria-label={isCarousel ? `Productos de la colección ${title}` : undefined}
      >
        {products.map((product) => {
          const image = imageOverrides[product.slug]
          const hasProductMedia = Boolean(image) || hasVerifiedProductMedia(product)
          const productImage = image || product.model || product.product || '/placeholder.svg'

          return (
            <Link
              key={product.slug}
              id={`${carouselId}-${product.slug}`}
              href={`/product/${product.slug}`}
              className={`featured-collection-product group ${
                isCarousel ? 'featured-collection-slide' : ''
              }`}
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

      {isCarousel ? (
        <div className="featured-collection-carousel-controls">
          <button
            type="button"
            className="featured-collection-carousel-button featured-collection-carousel-button--prev"
            aria-label={`Ver producto anterior de ${title}`}
            onClick={() => scrollToPage(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
          >
            <ArrowIcon className="size-4" />
          </button>

          <div className="featured-collection-carousel-dots" aria-hidden="true">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={`${carouselId}-page-${index}`}
                type="button"
                className={`featured-collection-carousel-dot ${
                  index === activeIndex
                    ? 'featured-collection-carousel-dot--active'
                    : ''
                }`}
                tabIndex={-1}
                onClick={() => scrollToPage(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className="featured-collection-carousel-button"
            aria-label={`Ver siguiente producto de ${title}`}
            onClick={() =>
              scrollToPage(Math.min(activeIndex + 1, pageCount - 1))
            }
            disabled={activeIndex === pageCount - 1}
          >
            <ArrowIcon className="size-4" />
          </button>
        </div>
      ) : null}
    </section>
  )
}
