'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cloudinaryImage } from '@/lib/cloudinary-assets'
import { CloseIcon, MenuIcon } from './icons'

const logoImage = cloudinaryImage('/images/isole-logo-wordmark.png')

const leftLinks = [
  { label: 'Colecciones', href: '/#colecciones' },
  { label: 'Catálogo', href: '/catalogo/todos-los-articulos' },
  { label: 'Showroom', href: '/#showroom' },
]

const rightLinks = [
  { label: 'Historia', href: '/#historia' },
  { label: 'Comunidad', href: '/#comunidad' },
  { label: 'Contacto', href: '/#contacto' },
]

const allLinks = [...leftLinks, ...rightLinks]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const menuRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.checked = false
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(46,37,33,0.06)]'
          : 'bg-transparent md:bg-cream/95 md:shadow-[0_1px_0_0_rgba(46,37,33,0.06)]'
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:h-24 md:px-10"
      >
        <ul className="hidden flex-1 items-center gap-8 md:flex">
          {leftLinks.map((link) => (
            <li key={link.href}>
              <NavItem {...link} />
            </li>
          ))}
        </ul>

        <div className="md:hidden">
          <input
            ref={menuRef}
            id="mobile-menu-toggle"
            type="checkbox"
            className="peer sr-only"
            aria-hidden="true"
          />
          <label
            htmlFor="mobile-menu-toggle"
            className="-ml-3 flex size-11 cursor-pointer items-center justify-center text-ink"
            aria-label="Abrir menú"
          >
            <MenuIcon className="size-6" />
          </label>

          <div className="fixed inset-0 z-[60] hidden min-h-svh flex-col overflow-y-auto bg-cream peer-checked:flex">
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-coral/15 bg-nude px-5">
              <span className="brand-subtitle text-4xl leading-none text-coral">
                ISOLÉ
              </span>
              <label
                htmlFor="mobile-menu-toggle"
                aria-label="Cerrar menú"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-300 hover:bg-cream/55"
              >
                <CloseIcon className="size-6" />
              </label>
            </div>

            <ul className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
              {allLinks.map((link) => (
                <li
                  key={link.href}
                  className="border-b border-coral/15 last:border-b-0"
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-16 items-center justify-between py-4 font-serif text-3xl leading-none text-ink transition-colors duration-300 hover:text-coral"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs font-sans uppercase tracking-[0.18em] text-coral">
                      Ver
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="shrink-0 px-6 pb-8 text-center text-[0.68rem] uppercase tracking-luxe text-coral">
              ISOLÉ
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center px-6"
          aria-label="ISOLÉ, ir al inicio"
        >
          {logoFailed ? (
            <span
              className={`brand-subtitle text-5xl leading-none text-coral transition-all duration-700 ease-luxe md:text-6xl ${
                scrolled ? 'opacity-100' : 'opacity-95'
              }`}
              aria-hidden="true"
            >
              ISOLÉ
            </span>
          ) : (
            <img
              src={logoImage}
              alt=""
              className={`w-[180px] max-w-[52vw] transition-all duration-700 ease-luxe md:w-[196px] ${
                scrolled ? 'opacity-100' : 'opacity-95'
              }`}
              aria-hidden="true"
              onError={() => setLogoFailed(true)}
            />
          )}
        </Link>

        <ul className="hidden flex-1 items-center justify-end gap-8 md:flex">
          {rightLinks.map((link) => (
            <li key={link.href}>
              <NavItem {...link} />
            </li>
          ))}
        </ul>

        <span className="w-6 md:hidden" aria-hidden="true" />
      </nav>
    </header>
  )
}

function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative text-xs font-medium uppercase tracking-[0.18em] text-ink/80 transition-colors duration-500 hover:text-ink"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-coral transition-all duration-500 ease-luxe group-hover:w-full" />
    </Link>
  )
}
