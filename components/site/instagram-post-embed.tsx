import Image from 'next/image'
import { Play } from 'lucide-react'
import { CloseIcon } from './icons'

type InstagramPostEmbedProps = {
  embedUrl: string
  label?: string
  previewAlt: string
  previewSrc: string
  toggleId: string
}

export function InstagramPostEmbed({
  embedUrl,
  label = 'Isabella',
  previewAlt,
  previewSrc,
  toggleId,
}: InstagramPostEmbedProps) {
  return (
    <div className="relative">
      <input
        id={toggleId}
        type="checkbox"
        className="peer sr-only"
        aria-hidden="true"
      />

      <label
        htmlFor={toggleId}
        role="button"
        tabIndex={0}
        aria-label={`Reproducir reel de ${label}`}
        className="group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-sm bg-ink text-left"
      >
        <Image
          src={previewSrc}
          alt={previewAlt}
          fill
          sizes="(max-width: 768px) 33vw, 22vw"
          className="object-cover transition-transform duration-[1100ms] ease-luxe group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ink">
          Reel
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-cream/90 text-coral shadow-lg shadow-ink/15 transition-transform duration-500 group-hover:scale-105">
            <Play className="ml-0.5 size-5 fill-current" strokeWidth={1.6} />
          </span>
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3">
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-cream">
            {label}
          </span>
          <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.12em] text-cream/75">
            Tocar para reproducir
          </span>
        </span>
      </label>

      <div
        className="fixed inset-0 z-[80] hidden items-center justify-center bg-ink/80 px-4 py-6 backdrop-blur-sm peer-checked:flex"
        role="dialog"
        aria-modal="true"
        aria-label="Reel de Isabella"
      >
        <label
          htmlFor={toggleId}
          aria-label="Cerrar reel"
          className="absolute inset-0 cursor-pointer"
        />
        <div className="relative h-[min(84vh,760px)] w-full max-w-[430px] overflow-hidden rounded-sm bg-cream shadow-2xl">
          <label
            htmlFor={toggleId}
            aria-label="Cerrar reel"
            className="absolute right-3 top-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-cream text-ink shadow-lg"
          >
            <CloseIcon className="size-5" />
          </label>
          <iframe
            title="Publicacion de Isabella en Instagram"
            src={embedUrl}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
