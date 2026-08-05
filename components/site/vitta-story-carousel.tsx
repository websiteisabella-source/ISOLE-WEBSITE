'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const slides = [
  {
    src: '/images/vitta-story-1.jpg',
    alt: 'Seleccion de jeans Vitta en tonos azul y negro',
  },
  {
    src: '/images/vitta-story-2.jpg',
    alt: 'Editorial Vitta con prenda en luz natural',
  },
  {
    src: '/images/vitta-story-3.jpg',
    alt: 'Detalle de temporada Vitta en tienda',
  },
  {
    src: '/images/vitta-story-4.jpg',
    alt: 'Texturas y prendas de la coleccion Vitta',
  },
]

const SLIDE_DURATION_MS = 4200

export function VittaStoryCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, SLIDE_DURATION_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <Link
      href="/catalogo/vitta"
      className="editorial-collection-banner group"
      aria-label="Ver coleccion Vitta"
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`editorial-collection-banner__image object-cover object-center transition-transform duration-700 ease-luxe group-hover:scale-[1.03] ${
            index === activeSlide
              ? 'editorial-collection-banner__image--active'
              : ''
          }`}
        />
      ))}
      <span className="editorial-collection-banner__shade" aria-hidden="true" />
      <span className="editorial-collection-banner__label">Nueva coleccion</span>
      <span className="editorial-collection-banner__progress" aria-hidden="true">
        {slides.map((slide, index) => (
          <span
            key={slide.src}
            className={`editorial-collection-banner__dot ${
              index === activeSlide
                ? 'editorial-collection-banner__dot--active'
                : ''
            }`}
          />
        ))}
      </span>
    </Link>
  )
}
