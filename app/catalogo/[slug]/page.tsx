import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/site/footer'
import { ArrowIcon } from '@/components/site/icons'
import { LiveCatalogProducts } from '@/components/site/live-catalog-products'
import { Navbar } from '@/components/site/navbar'
import { ProductCard } from '@/components/site/product-card'
import { Reveal } from '@/components/site/reveal'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'
import {
  catalogGroups,
  getActiveProducts,
  getCatalogGroup,
  getCatalogProducts,
  type CatalogGroup,
  type Product,
} from '@/lib/products'
import { absoluteUrl, SITE_NAME } from '@/lib/site'

const collections = catalogGroups.filter((group) => group.type === 'collection')
const categories = catalogGroups.filter((group) => group.type === 'category')
const allProductsGroup = catalogGroups.find(
  (group) => group.slug === 'todos-los-articulos',
)

export function generateStaticParams() {
  return catalogGroups.map((group) => ({ slug: group.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const group = getCatalogGroup(slug)

  if (!group) {
    return { title: SITE_NAME }
  }

  return {
    title: `${group.name} | Catálogo ${SITE_NAME}`,
    description:
      group.description ??
      (group.type === 'aggregate'
        ? `Todos los artículos activos del catálogo ${SITE_NAME}.`
        : `Productos de ${group.name} disponibles en el catálogo ${SITE_NAME}.`),
    alternates: {
      canonical: absoluteUrl(`/catalogo/${group.slug}`),
    },
  }
}

export default async function CatalogGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const group = getCatalogGroup(slug)

  if (!group) {
    notFound()
  }

  const products = getCatalogProducts(group)
  const sections =
    group.type === 'aggregate' ? getAggregateSections(products) : []

  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-10 md:pb-32">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-500 hover:text-coral"
          >
            <ArrowIcon className="size-4 rotate-180" />
            Volver al inicio
          </Link>

          <Reveal className="mt-10 overflow-hidden rounded-sm bg-nude/70 md:mt-14">
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]">
              <div className="px-6 py-12 md:px-12 md:py-16">
                <span className="text-[0.7rem] uppercase tracking-luxe text-coral">
                  {group.type === 'collection'
                    ? 'Colección'
                    : group.type === 'category'
                      ? 'Categoría'
                      : 'Catálogo ISOLÉ'}
                </span>
                <h1 className="editorial-title mt-5 max-w-3xl text-balance text-5xl text-ink md:text-7xl">
                  {group.name}
                </h1>
                <p className="mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {group.description ??
                    (group.type === 'aggregate'
                      ? 'Una vista viva del showroom: colecciones, categorías y piezas activas reunidas sin repetir artículos.'
                      : 'Una selección del catálogo actual organizada para explorar con calma, conservando la estética cálida y expresiva de ISOLÉ.')}
                </p>
              </div>
              <div className="flex min-h-64 flex-col justify-end bg-lavender px-6 py-10 text-nude md:px-10">
                <p className="brand-subtitle text-5xl leading-none md:text-6xl">
                  identidad,
                  <br />
                  luz y evolución
                </p>
                <p className="mt-8 text-[0.68rem] uppercase tracking-luxe">
                  {products.length} {products.length === 1 ? 'artículo' : 'artículos'}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <CatalogNavBlock
              title="Colecciones"
              groups={collections}
              activeSlug={group.slug}
            />
            <CatalogNavBlock
              title="Categorías"
              groups={categories}
              activeSlug={group.slug}
            />
          </Reveal>

          {allProductsGroup && (
            <Reveal className="mt-6 flex justify-center">
              <CatalogLink group={allProductsGroup} activeSlug={group.slug} />
            </Reveal>
          )}

          <LiveCatalogProducts
            currentSlug={group.slug}
            groupType={group.type}
            staticSlugs={products.map((product) => product.slug)}
          >
            {group.type === 'aggregate' ? (
              <div className="mt-16 space-y-20">
                {sections.map((section, sectionIndex) => (
                  <CatalogSection
                    key={section.slug}
                    section={section}
                    delay={sectionIndex * 0.04}
                  />
                ))}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </LiveCatalogProducts>

          {products.length === 0 && (
            <p className="mt-14 text-center text-sm leading-relaxed text-muted-foreground">
              Este apartado todavía no tiene productos activos.
            </p>
          )}
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

function CatalogNavBlock({
  title,
  groups,
  activeSlug,
}: {
  title: string
  groups: CatalogGroup[]
  activeSlug: string
}) {
  return (
    <div className="border-t border-coral/25 pt-5">
      <p className="mb-4 text-[0.68rem] uppercase tracking-luxe text-coral">
        {title}
      </p>
      <div className="flex flex-wrap gap-3">
        {groups.map((group) => (
          <CatalogLink key={group.slug} group={group} activeSlug={activeSlug} />
        ))}
      </div>
    </div>
  )
}

function CatalogLink({
  group,
  activeSlug,
}: {
  group: CatalogGroup
  activeSlug: string
}) {
  return (
    <Link
      href={`/catalogo/${group.slug}`}
      aria-current={group.slug === activeSlug ? 'page' : undefined}
      className={`rounded-full border px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ${
        group.slug === activeSlug
          ? 'border-coral bg-coral text-primary-foreground'
          : 'border-coral/35 text-ink hover:border-coral hover:text-coral'
      }`}
    >
      {group.name}
    </Link>
  )
}

function CatalogSection({
  section,
  delay,
}: {
  section: {
    slug: string
    name: string
    label: string
    products: Product[]
  }
  delay: number
}) {
  return (
    <section>
      <Reveal delay={delay} className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[0.68rem] uppercase tracking-luxe text-coral">
            {section.label}
          </span>
          <h2 className="editorial-title mt-3 text-4xl text-ink md:text-5xl">
            {section.name}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {section.products.length}{' '}
          {section.products.length === 1 ? 'artículo' : 'artículos'}
        </p>
      </Reveal>
      <ProductGrid products={section.products} compact />
    </section>
  )
}

function ProductGrid({
  products,
  compact = false,
}: {
  products: Product[]
  compact?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-7 ${
        compact ? 'md:grid-cols-3' : 'mt-14 md:grid-cols-3'
      }`}
    >
      {products.map((product, i) => (
        <Reveal key={product.slug} delay={i * 0.06}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  )
}

function getAggregateSections(allProducts: Product[]) {
  const productBySlug = new Map(allProducts.map((product) => [product.slug, product]))
  const assigned = new Set<string>()
  const sections = catalogGroups
    .filter((group) => group.type !== 'aggregate')
    .map((group) => {
      const groupProducts = (group.productSlugs ?? [])
        .map((slug) => productBySlug.get(slug))
        .filter((product): product is Product => Boolean(product))

      groupProducts.forEach((product) => assigned.add(product.slug))

      return {
        slug: group.slug,
        name: group.name,
        label: group.type === 'collection' ? 'Colección' : 'Categoría',
        products: groupProducts,
      }
    })
    .filter((section) => section.products.length > 0)

  const ungrouped = getActiveProducts().filter(
    (product) => !assigned.has(product.slug),
  )

  if (ungrouped.length > 0) {
    sections.unshift({
      slug: 'editorial',
      name: 'Selección editorial',
      label: 'Destacados',
      products: ungrouped,
    })
  }

  return sections
}
