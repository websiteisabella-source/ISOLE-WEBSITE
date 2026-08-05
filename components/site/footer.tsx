import Link from 'next/link'
import { INSTAGRAM_URL, SITE_NAME, whatsappLink } from '@/lib/site'
import { ArrowIcon, InstagramIcon, PinIcon, WhatsAppIcon } from './icons'
import { cloudinaryImage } from '@/lib/cloudinary-assets'

const logoImage = cloudinaryImage('/images/isole-logo-wordmark.png')

export function Footer() {
  return (
    <footer
      id="contacto"
      className="footer-minimal brand-organic relative bg-nude/45 px-5 pt-7 pb-14 text-ink md:bg-nude md:px-10 md:pt-24 md:pb-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="md:hidden">
          <div className="max-w-[23rem]">
            <h2 className="font-serif text-[0.78rem] font-normal leading-none text-ink">
              Siempre local
            </h2>
            <p className="mt-4 max-w-[21rem] text-[0.62rem] leading-[1.8] text-ink">
              Soñamos con un 100% hecho en Colombia, aunque este es un camino
              largo, nuestros talleres y empresa se constituyen en Santander
            </p>

            <div className="mt-5 flex items-center gap-6 text-ink/70">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="font-sans text-lg font-bold leading-none transition-colors hover:text-coral"
              >
                f
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors hover:text-coral"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={whatsappLink(
                  `Hola ${SITE_NAME}, me gustaría más información.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition-colors hover:text-coral"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>

            <nav className="mt-7 flex flex-col gap-3 text-[0.6rem] text-ink">
              <Link href="/politicas-cambios-devoluciones">
                Políticas de Cambios y Devoluciones
              </Link>
              <Link href="/politicas-privacidad">Políticas de Privacidad</Link>
              <Link href="/envios">Envíos</Link>
            </nav>

            <form className="mt-8">
              <label
                htmlFor="footer-mobile-email"
                className="text-[0.62rem] font-bold text-ink"
              >
                Newsletter
              </label>
              <p className="mt-3 text-[0.58rem] leading-relaxed text-ink">
                Suscríbete para tener la primicia de nuestro universo.
              </p>
              <div className="mt-8 flex items-center border-b border-ink/35 pb-2">
                <input
                  id="footer-mobile-email"
                  type="email"
                  placeholder="Correo electrónico"
                  className="min-w-0 flex-1 bg-transparent text-[0.58rem] text-ink outline-none placeholder:text-ink"
                />
                <button
                  type="submit"
                  aria-label="Suscribirme"
                  className="px-1 text-ink transition-colors hover:text-coral"
                >
                  <ArrowIcon className="size-4" />
                </button>
              </div>
            </form>

            <p className="mt-20 text-[0.55rem] uppercase tracking-[0.18em] text-ink">
              &copy; 2026 I S O L E.
            </p>
          </div>
        </div>

        <div className="hidden max-w-sm md:block">
          <img src={logoImage} alt="ISOLÉ" className="w-[210px]" />
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            Una casa de moda romántica y natural. Cada pieza nace para ser
            sentida, no solo vestida.
          </p>
        </div>

        <div className="mt-16 hidden grid-cols-2 gap-10 border-t border-coral/25 pt-12 md:grid md:grid-cols-4">
          <FooterCol title="Casa">
            <FooterLink href="/#colecciones">Colecciones</FooterLink>
            <FooterLink href="/catalogo/todos-los-articulos">Catálogo</FooterLink>
            <FooterLink href="/historia">Nuestra historia</FooterLink>
            <FooterLink href="/comunidad">Comunidad</FooterLink>
          </FooterCol>

          <FooterCol title="Dirección de tienda">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <PinIcon className="mt-0.5 size-4 shrink-0" />
              Calle del Atardecer 14
            </p>
            <p className="text-sm text-muted-foreground">Mar a Sáb / 11:00 a 20:00</p>
            <p className="text-sm text-muted-foreground">Cita previa disponible</p>
          </FooterCol>

          <FooterCol title="Contacto">
            <a
              href={whatsappLink(
                `Hola ${SITE_NAME}, me gustaría más información.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-coral"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-coral"
            >
              <InstagramIcon className="size-4" /> Instagram
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-coral"
            >
              Comunidad ISOLÉ
            </a>
          </FooterCol>

          <FooterCol title="Atelier">
            <p className="text-sm text-muted-foreground">
              Piezas en cantidades limitadas, confeccionadas con materiales
              naturales.
            </p>
          </FooterCol>
        </div>

        <div className="mt-16 hidden flex-col items-center justify-between gap-4 border-t border-coral/25 pt-8 text-xs text-muted-foreground md:flex md:flex-row">
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
      <h3 className="mb-1 text-[0.7rem] uppercase tracking-[0.2em] text-coral">
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
      className="text-sm text-muted-foreground transition-colors duration-500 hover:text-coral"
    >
      {children}
    </Link>
  )
}
