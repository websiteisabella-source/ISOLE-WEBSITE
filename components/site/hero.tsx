'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { CtaLink } from './cta-button'
import { ArrowIcon } from './icons'
import { cloudinaryImage } from '@/lib/cloudinary-assets'
import { HERO_VIDEO_URL } from '@/lib/site'

const heroImage = cloudinaryImage('/images/hero.png')

export function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden md:mt-20 md:h-[calc(100svh-5rem)]">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Poster / fallback still. Always rendered for a fast LCP and as the
            backdrop while the optional loop video buffers. */}
        <Image
          src={heroImage}
          alt="Mujer con vestido de lino al atardecer en una terraza mediterránea"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {HERO_VIDEO_URL && (
          <video
            className="absolute inset-0 size-full object-cover object-center"
            src={HERO_VIDEO_URL}
            poster={heroImage}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/40" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center md:justify-center md:pb-0">
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-5 text-[0.7rem] uppercase tracking-luxe text-cream/90"
        >
          Lookbook / Temporada Atardecer
        </motion.p>
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-title max-w-4xl px-6 text-balance text-5xl text-cream sm:text-6xl md:text-8xl"
        >
          Vestir la luz <span className="italic">de la tarde</span>
        </motion.h1>
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10"
        >
          <CtaLink href="/#colecciones" variant="coral">
            Descubrir la colección
            <ArrowIcon className="size-4" />
          </CtaLink>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-luxe text-cream/80">
          Desliza
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="h-10 w-px bg-cream/60"
        />
      </motion.div>
    </section>
  )
}
