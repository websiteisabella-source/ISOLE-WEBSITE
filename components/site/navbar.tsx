'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CloseIcon, HeartSunIcon, MenuIcon } from './icons'

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe ${
        scrolled
          ? 'bg-cream/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(46,37,33,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10"
      >
        <ul className="hidden flex-1 items-center gap-8 md:flex">
          {leftLinks.map((l) => (
            <li key={l.href}>
              <NavItem {...l} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-ink md:hidden"
          aria-label="Abrir menú"
        >
          <MenuIcon className="size-6" />
        </button>

        <Link
          href="/"
          className="flex flex-col items-center gap-1 px-6 text-ink"
          aria-label="ISOLÉ, ir al inicio"
        >
          <HeartSunIcon
            className={`size-5 text-coral transition-all duration-700 ease-luxe md:size-6 ${
              scrolled ? 'opacity-100' : 'opacity-90'
            }`}
            aria-hidden="true"
          />
          <span className="font-serif text-2xl leading-none tracking-[0.32em] md:text-3xl">
            ISOL&Eacute;
          </span>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col bg-nude md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="flex items-center gap-2 font-serif text-2xl tracking-[0.32em] text-ink">
                <HeartSunIcon className="size-5 text-coral" aria-hidden="true" />
                ISOL&Eacute;
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="text-ink"
              >
                <CloseIcon className="size-6" />
              </button>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-7">
              {allLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl text-ink"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
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
