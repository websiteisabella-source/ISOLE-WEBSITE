'use client'

import { motion } from 'motion/react'
import { CtaLink } from './cta-button'
import { ArrowIcon } from './icons'
import { HERO_VIDEO_MIME_TYPE, HERO_VIDEO_URL } from '@/lib/site'

export function Hero() {
  return (
    <section className="brand-hero relative h-[932px] min-h-[932px] w-full overflow-hidden md:h-[calc(100svh-2.25rem)] md:min-h-[720px] md:max-h-[900px]">
      {HERO_VIDEO_URL && (
        <link
          rel="preload"
          href={HERO_VIDEO_URL}
          as="video"
          type={HERO_VIDEO_MIME_TYPE}
          crossOrigin="anonymous"
        />
      )}

      <motion.div
        className="absolute inset-0 bg-ink"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {HERO_VIDEO_URL && (
          <video
            className="hero-video absolute inset-0 size-full object-cover object-center"
            src={HERO_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/24 via-ink/6 to-ink/48" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-5 hidden text-[0.7rem] uppercase tracking-luxe text-petal md:block"
        >
          Lookbook / Temporada Atardecer
        </motion.p>
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-title hidden max-w-4xl text-balance text-5xl text-cream sm:text-6xl md:block md:text-8xl"
        >
          Vestir la luz de la tarde
        </motion.h1>
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-7 hidden md:mt-10 md:block"
        >
          <CtaLink href="/#colecciones" variant="coral">
            Descubrir la colección
            <ArrowIcon className="size-4" />
          </CtaLink>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute inset-x-0 top-[38svh] z-10 flex flex-col items-center px-6 text-center md:hidden"
        >
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.24em] text-cream/90">
            Lookbook / Temporada Atardecer
          </p>
          <h1 className="editorial-title mt-3 max-w-[21rem] text-balance text-[4.1rem] leading-[0.84] text-cream">
            Vestir la luz de la tarde
          </h1>
          <CtaLink
            href="/#colecciones"
            variant="coral"
            className="mt-6 px-6 py-3 text-[0.58rem] tracking-[0.16em]"
          >
            Descubrir la colección
            <ArrowIcon className="size-3.5" />
          </CtaLink>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.45, duration: 1 }}
        className="brand-hero__palette"
        aria-hidden="true"
      >
        <span className="bg-coral" />
        <span className="bg-lavender" />
        <span className="bg-petal" />
        <span className="bg-nude" />
      </motion.div>

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
