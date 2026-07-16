'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

export function ProductGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">
      <div className="flex gap-3 md:flex-col">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver imagen ${i + 1} de ${name}`}
            aria-current={i === active}
            className={cn(
              'relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-sm transition-all duration-500 md:w-20',
              i === active
                ? 'ring-2 ring-coral ring-offset-2 ring-offset-background'
                : 'opacity-60 hover:opacity-100',
            )}
          >
            <Image
              src={src || '/placeholder.svg'}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative aspect-[3/4] flex-1 overflow-hidden rounded-sm bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[active] || '/placeholder.svg'}
              alt={`${name} - imagen ${active + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
