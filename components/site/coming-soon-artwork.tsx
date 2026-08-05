import { HeartSunIcon } from './icons'

export function ComingSoonArtwork({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={`flex size-full flex-col items-center justify-center bg-nude/70 px-8 text-center transition-colors duration-[900ms] ease-luxe group-hover:bg-petal/45 ${className}`}
    >
      <HeartSunIcon className="size-14 text-coral" />
      <span className="mt-8 text-[0.62rem] uppercase tracking-luxe text-coral">
        {label}
      </span>
      <span className="brand-subtitle mt-3 text-4xl text-ink">
        Próximamente
      </span>
    </div>
  )
}
