'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CloseIcon, MenuIcon } from './icons'
import { cloudinaryImage } from '@/lib/cloudinary-assets'

const logoImage = cloudinaryImage('/images/isole-logo-wordmark.png')

const leftLinks = [
  { label: 'Colecciones', href: '/#colecciones' },
  { label: 'Novedades', href: '/#novedades' },
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
          {leftLinks.map((l) => (
            <li key={l.href}>
              <NavItem {...l} />
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
            aria-label="Abrir menu"
          >
            <MenuIcon className="size-6" />
          </label>

          <div className="fixed inset-0 z-[60] hidden flex-col bg-nude peer-checked:flex">
            <div className="flex h-20 items-center justify-between px-5">
              <img
                src={logoImage}
                alt="ISOLÉ"
                className="w-[180px] max-w-[52vw]"
              />
              <label
                htmlFor="mobile-menu-toggle"
                aria-label="Cerrar menu"
                className="cursor-pointer text-ink"
              >
                <CloseIcon className="size-6" />
              </label>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-7">
              {allLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={closeMenu}
                    className="font-serif text-3xl text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center px-6"
          aria-label="ISOLÉ, ir al inicio"
        >
          <img
            src={logoImage}
            alt=""
            className={`w-[180px] max-w-[52vw] transition-all duration-700 ease-luxe md:w-[196px] ${
              scrolled ? 'opacity-100' : 'opacity-95'
            }`}
            aria-hidden="true"
          />
        </Link>

        <ul className="hidden flex-1 items-center justify-end gap-8 md:flex">
          {rightLinks.map((l) => (
            <li key={l.href}>
              <NavItem {...l} />
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
