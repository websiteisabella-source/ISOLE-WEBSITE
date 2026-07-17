import Link from 'next/link'
import { INSTAGRAM_URL, SITE_NAME, whatsappLink } from '@/lib/site'
import { Newsletter } from './newsletter'
import { InstagramIcon, PinIcon, WhatsAppIcon } from './icons'

export function Footer() {
  return (
    <footer
      id="contacto"
      className="relative bg-ink px-5 pt-20 pb-10 text-cream md:px-10 md:pt-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-4xl tracking-[0.3em] md:text-5xl">
              ISOL&Eacute;
            </p>
            <p className="mt-6 text-sm leading-relaxed text-cream/70">
              Una casa de moda romántica y natural. Cada pieza nace para ser
              sentida, no solo vestida.
            </p>
          </div>

          <Newsletter />
        </div>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-cream/15 pt-12 md:grid-cols-4">
          <FooterCol title="Casa">
            <FooterLink href="/#colecciones">Colecciones</FooterLink>
            <FooterLink href="/#novedades">Novedades</FooterLink>
            <FooterLink href="/#historia">Nuestra historia</FooterLink>
            <FooterLink href="/#comunidad">Comunidad</FooterLink>
          </FooterCol>

          <FooterCol title="Showroom">
            <p className="flex items-start gap-2 text-sm text-cream/70">
              <PinIcon className="mt-0.5 size-4 shrink-0" />
              Calle del Atardecer 14
              <br />
            </p>
            <p className="text-sm text-cream/70">Mar a Sáb / 11:00 a 20:00</p>
            <p className="text-sm text-cream/70">Cita previa disponible</p>
          </FooterCol>

          <FooterCol title="Contacto">
            <a
              href={whatsappLink(
                `Hola ${SITE_NAME}, me gustaría más información.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-coral"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-coral"
            >
              <InstagramIcon className="size-4" /> Instagram
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream/70 transition-colors hover:text-coral"
            >
              Isabella
            </a>
          </FooterCol>

          <FooterCol title="Atelier">
            <p className="text-sm text-cream/70">
              Piezas en cantidades limitadas, confeccionadas con materiales
              naturales.
            </p>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-8 text-xs text-cream/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Hecho con calma.</p>
          <p className="uppercase tracking-[0.2em]">Disponible en tienda física</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-cream/50">
        {title}
      </h3>
      {children}
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-sm text-cream/70 transition-colors duration-500 hover:text-coral"
    >
      {children}
    </Link>
  )
}
