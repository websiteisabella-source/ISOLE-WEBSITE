'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cloudinaryImage } from '@/lib/cloudinary-assets'

const manifestoImage = cloudinaryImage('/images/manifesto.png')

export function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      id="showroom"
      ref={ref}
      className="relative grain flex min-h-[90svh] items-center justify-center overflow-hidden px-5 py-32 md:px-10"
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={manifestoImage}
          alt="Mujer caminando entre hierba dorada al atardecer"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
      </motion.div>

      <motion.blockquote
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-4xl text-center"
      >
        <p className="text-[0.7rem] uppercase tracking-luxe text-petal">
          Manifiesto
        </p>
        <p className="editorial-title mt-8 text-balance text-3xl text-cream sm:text-4xl md:text-6xl">
          Creemos en la belleza que no grita.
          <br />
          En vestir despacio, en lo natural, y en la emoción de sentirse una
          misma.
        </p>
        <p className="mx-auto mt-10 max-w-lg text-sm leading-relaxed text-cream/75">
          ISOLÉ no es una tienda. Es una invitación a habitar la ropa con calma y
          a celebrar lo femenino en su forma más auténtica.
        </p>
      </motion.blockquote>
    </section>
  )
}
