'use client'

import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cloudinaryImage } from '@/lib/cloudinary-assets'
import { getActiveProducts } from '@/lib/products'
import { CloseIcon, MenuIcon } from './icons'

const logoImage = cloudinaryImage('/images/isole-logo-wordmark.png')

const leftLinks = [
  { label: 'Colecciones', href: '/#colecciones' },
  { label: 'Catálogo', href: '/catalogo/todos-los-articulos' },
  { label: 'Nosotros', href: '/historia' },
]

const rightLinks = [
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Contacto', href: '/#contacto' },
]

const allLinks = [...leftLinks, ...rightLinks]
const searchableProducts = getActiveProducts()
const catalogMenuLinks = [
  { label: 'Todo', href: '/catalogo/todos-los-articulos' },
  { label: 'Swimwear', href: '/catalogo/swimwear' },
  { label: 'Vestidos', href: '/catalogo/vestidos' },
  { label: 'Prendas superiores', href: '/catalogo/prendas-superiores' },
  { label: 'Prendas inferiores', href: '/catalogo/prendas-inferiores' },
  { label: 'Jeans', href: '/catalogo/jeans' },
  { label: 'Complementos', href: '/catalogo/complementos' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuView, setMenuView] = useState<'main' | 'catalog'>('main')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const floatsOverHero = pathname === '/' && !scrolled
  const showAnnouncement = pathname === '/' && !scrolled

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return searchableProducts.slice(0, 6)
    }

    return searchableProducts
      .filter((product) =>
        [product.name, product.category, product.shortDescription]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term)),
      )
      .slice(0, 8)
  }, [searchTerm])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setMenuView('main')
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchTerm('')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe ${
        scrolled
          ? 'bg-cream/92 backdrop-blur-md shadow-[0_1px_0_0_rgba(46,37,33,0.08)]'
          : floatsOverHero
            ? 'bg-transparent'
            : 'bg-cream/88 backdrop-blur-sm md:bg-cream/78 md:shadow-[0_1px_0_0_rgba(46,37,33,0.06)]'
      }`}
    >
      <div
        className={`flex items-center justify-center overflow-hidden whitespace-nowrap border-b border-coral/10 bg-cream px-3 text-center font-medium leading-none text-ink transition-all duration-500 ease-luxe md:px-4 ${
          showAnnouncement
            ? 'h-7 translate-y-0 opacity-100 md:h-9 md:text-[0.82rem]'
            : 'h-0 -translate-y-2 border-transparent opacity-0 md:h-0'
        } text-[0.62rem]`}
        aria-hidden={!showAnnouncement}
      >
        Envio gratis por compras superiores a $400.000
      </div>
      <nav
        aria-label="Principal"
        className="relative mx-auto grid h-16 max-w-7xl grid-cols-[3rem_1fr_3rem] items-center px-5 md:h-24 md:grid-cols-[220px_1fr_220px] md:px-10"
      >
        <div className="absolute left-5 top-1/2 flex -translate-y-1/2 items-center md:hidden">
          <button
            type="button"
            className={`-ml-3 flex size-11 cursor-pointer items-center justify-center transition-colors duration-500 ${
              floatsOverHero
                ? 'text-cream drop-shadow-[0_0.35rem_1rem_rgba(46,37,33,0.35)]'
                : 'text-ink'
            }`}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon className="size-6" />
          </button>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 items-center justify-center md:static md:col-start-1 md:translate-x-0 md:translate-y-0 md:justify-start"
            aria-label="ISOLÉ, ir al inicio"
          style={{ width: 'fit-content' }}
        >
          <img
            src={logoImage}
            alt=""
            className={`site-mobile-wordmark block w-[106px] max-w-[30vw] transition-all duration-700 ease-luxe md:hidden ${
              floatsOverHero
                ? 'site-mobile-wordmark--light drop-shadow-[0_0.45rem_1.4rem_rgba(46,37,33,0.36)]'
                : ''
            }`}
            aria-hidden="true"
          />
          {logoFailed ? (
            <span
              className={`brand-subtitle hidden text-5xl leading-none text-coral transition-all duration-700 ease-luxe md:text-6xl ${
                floatsOverHero ? '' : 'md:inline'
              } ${scrolled ? 'opacity-100' : 'opacity-95'}`}
              aria-hidden="true"
            >
              ISOLÉ
            </span>
          ) : (
            <img
              src={logoImage}
              alt=""
              className={`hidden w-[176px] max-w-[52vw] transition-all duration-700 ease-luxe md:w-[192px] ${
                floatsOverHero ? 'site-mobile-wordmark--light md:block' : 'md:block'
              } ${scrolled ? 'opacity-100' : 'opacity-95'}`}
              aria-hidden="true"
              onError={() => setLogoFailed(true)}
            />
          )}
        </Link>

        <ul className="hidden items-center justify-center gap-10 md:flex">
          {leftLinks.map((link) => (
            <li key={link.href}>
              <NavItem {...link} overHero={floatsOverHero} />
            </li>
          ))}
        </ul>

        <ul className="hidden items-center justify-end gap-8 md:flex">
          {rightLinks.map((link) => (
            <li key={link.href}>
              <NavItem {...link} overHero={floatsOverHero} />
            </li>
          ))}
        </ul>

        <div
          className={`absolute right-5 top-1/2 flex -translate-y-1/2 items-center justify-end md:hidden ${
            floatsOverHero
              ? 'text-cream drop-shadow-[0_0.35rem_1rem_rgba(46,37,33,0.35)]'
              : 'text-ink'
          }`}
        >
          <button
            type="button"
            aria-label="Buscar en el catálogo"
            className="flex size-9 items-center justify-center transition-colors duration-300 hover:text-coral"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" strokeWidth={1.4} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] flex min-h-svh flex-col overflow-y-auto bg-cream text-ink md:hidden">
          <div className="relative flex h-20 shrink-0 items-center justify-center px-6">
            <button
              type="button"
              aria-label="Cerrar menu"
              className="absolute left-5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-ink"
              onClick={closeMenu}
            >
              <CloseIcon className="size-5" />
            </button>
            <img src={logoImage} alt="" className="w-[112px]" aria-hidden="true" />
            <button
              type="button"
              aria-label="Buscar en el catálogo"
              className="absolute right-5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-ink"
              onClick={() => {
                closeMenu()
                setSearchOpen(true)
              }}
            >
              <Search className="size-5" strokeWidth={1.35} />
            </button>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 pt-5 pb-8">
            {menuView === 'main' ? (
              <ul className="space-y-4">
                {allLinks.map((link, index) => (
                  <li key={link.href}>
                    {link.label === 'Catálogo' ? (
                      <button
                        type="button"
                        data-testid="mobile-catalog-menu-trigger"
                        className="flex w-full items-center justify-between text-left text-sm font-medium uppercase tracking-[0.02em] text-ink transition-colors duration-300 hover:text-coral"
                        onClick={() => setMenuView('catalog')}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="size-3.5" strokeWidth={1.5} />
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between text-sm font-medium uppercase tracking-[0.02em] text-ink transition-colors duration-300 hover:text-coral"
                      >
                        <span>{link.label}</span>
                        {index === 0 && (
                          <ChevronRight className="size-3.5" strokeWidth={1.5} />
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <button
                  type="button"
                  data-testid="mobile-catalog-menu-back"
                  className="mb-7 flex items-center gap-2 text-[0.72rem] text-ink/70 transition-colors duration-300 hover:text-coral"
                  onClick={() => setMenuView('main')}
                >
                  <span aria-hidden="true">‹</span>
                  Retroceder
                </button>
                <ul className="space-y-5">
                  {catalogMenuLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="block text-sm text-ink transition-colors duration-300 hover:text-coral"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-cream px-5 pt-8 text-ink md:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <span className="text-[0.68rem] uppercase tracking-luxe text-coral">
              Buscar
            </span>
            <button
              type="button"
              aria-label="Cerrar busqueda"
              className="flex size-10 items-center justify-center text-ink"
              onClick={closeSearch}
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="mx-auto mt-8 max-w-md border-b border-coral/30 pb-2">
            <label htmlFor="mobile-search" className="sr-only">
              Buscar en el catálogo
            </label>
            <div className="flex items-center gap-3">
              <Search className="size-5 shrink-0 text-coral" strokeWidth={1.4} />
              <input
                ref={searchInputRef}
                id="mobile-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar prendas"
                className="w-full bg-transparent text-xl font-medium text-ink placeholder:text-ink/35 focus:outline-none"
              />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <p className="mb-3 text-[0.62rem] uppercase tracking-[0.22em] text-coral">
              Resultados
            </p>
            <div className="divide-y divide-coral/15">
              {searchResults.map((product) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  className="block py-4"
                  onClick={closeSearch}
                >
                  <span className="block font-serif text-xl leading-tight text-ink">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.16em] text-ink/55">
                    {product.category}
                  </span>
                </Link>
              ))}
              {searchResults.length === 0 && (
                <p className="py-5 text-sm text-muted-foreground">
                  No encontramos prendas con ese nombre.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavItem({
  label,
  href,
  overHero = false,
}: {
  label: string
  href: string
  overHero?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group relative text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-500 ${
        overHero
          ? 'text-cream drop-shadow-[0_0.35rem_1rem_rgba(46,37,33,0.38)] hover:text-petal'
          : 'text-ink/80 hover:text-ink'
      }`}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-coral transition-all duration-500 ease-luxe group-hover:w-full" />
    </Link>
  )
}
