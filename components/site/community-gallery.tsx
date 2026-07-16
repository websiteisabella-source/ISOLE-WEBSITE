import Image from 'next/image'
import { INSTAGRAM_URL } from '@/lib/site'
import { InstagramIcon } from './icons'
import { Reveal } from './reveal'

const photos = [
  {
    src: '/images/community-1.png',
    alt: 'Mujer riendo bajo la luz del sol con prenda de lino crema',
  },
  {
    src: '/images/community-2.png',
    alt: 'Mujer con vestido coral tomando café en una terraza soleada',
  },
  { src: '/images/community-3.png', alt: 'Dos amigas caminando juntas al atardecer' },
  {
    src: '/images/community-4.png',
    alt: 'Mujer leyendo junto a la ventana con luz cálida',
  },
  {
    src: '/images/community-5.png',
    alt: 'Mujer girando con vestido coral en una azotea soleada',
  },
  {
    src: '/images/community-6.png',
    alt: 'Retrato cálido de mujer sonriendo a la luz natural',
  },
]

export function CommunityGallery() {
  return (
    <section id="comunidad" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <span className="text-[0.7rem] uppercase tracking-luxe text-coral">
            Comunidad
          </span>
          <h2 className="editorial-title mt-4 max-w-2xl text-balance text-4xl text-ink md:text-6xl">
            Mujeres reales, momentos reales
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-500 hover:text-coral"
          >
            <InstagramIcon className="size-5" />
            @isole.studio
          </a>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
          {photos.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 0.06}
              className={
                i === 0 || i === 3 ? 'col-span-2 md:col-span-2' : 'col-span-1'
              }
            >
              <div className="group relative aspect-square overflow-hidden rounded-sm">
                <Image
                  src={photo.src || '/placeholder.svg'}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover transition-transform duration-[1100ms] ease-luxe group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-coral/0 opacity-0 transition-all duration-500 group-hover:bg-ink/20 group-hover:opacity-100">
                  <InstagramIcon className="size-7 text-cream" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
