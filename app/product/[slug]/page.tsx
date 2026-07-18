import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaLink } from '@/components/site/cta-button'
import { Footer } from '@/components/site/footer'
import { ArrowIcon, WhatsAppIcon } from '@/components/site/icons'
import { Navbar } from '@/components/site/navbar'
import { ProductCard } from '@/components/site/product-card'
import { ProductGallery } from '@/components/site/product-gallery'
import { Reveal } from '@/components/site/reveal'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'
import {
  getProduct,
  getProductImages,
  getRelatedProducts,
  products,
} from '@/lib/products'
import {
  breadcrumbJsonLd,
  jsonLdScript,
  productJsonLd,
  productSeoDescription,
  productSeoTitle,
  productUrl,
} from '@/lib/seo'
import { SITE_NAME, whatsappLink } from '@/lib/site'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) {
    return { title: SITE_NAME }
  }

  return {
    title: productSeoTitle(product),
    description: productSeoDescription(product),
    alternates: {
      canonical: productUrl(product),
    },
    openGraph: {
      title: productSeoTitle(product),
      description: productSeoDescription(product),
      url: productUrl(product),
      type: 'website',
      images: getProductImages(product).map((image) => ({
        url: image,
        alt: `${product.name} de ${SITE_NAME}`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: productSeoTitle(product),
      description: productSeoDescription(product),
      images: [getProductImages(product)[0]],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) {
    notFound()
  }

  const related = getRelatedProducts(product)
  const images = getProductImages(product)
  const variantColors =
    product.variants
      ?.map((variant) => variant.color)
      .filter((color): color is string => Boolean(color)) ?? []
  const variantSizes =
    product.variants
      ?.map((variant) => variant.size)
      .filter((size): size is string => Boolean(size)) ?? []
  const sizes = product.sizes?.length
    ? product.sizes
    : Array.from(new Set(variantSizes))
  const details = [
    product.fabric ? { label: 'Tejido', value: product.fabric } : null,
    product.colors?.length
      ? { label: 'Colores', value: product.colors.join(' / ') }
      : null,
    variantColors.length
      ? { label: 'Variantes', value: variantColors.join(' / ') }
      : null,
    {
      label: 'Tallas',
      value: sizes.length ? sizes.join(' / ') : 'Consultar disponibilidad',
    },
  ].filter((detail): detail is { label: string; value: string } =>
    Boolean(detail),
  )
  const message = `Hola ${SITE_NAME}, me gustaría consultar la disponibilidad y tallas de "${product.name}".`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(productJsonLd(product))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(product))}
      />
      <Navbar />
      <main className="pt-28 md:pt-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <Link
            href="/catalogo/todos-los-articulos"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-500 hover:text-coral"
          >
            <ArrowIcon className="size-4 rotate-180" />
            Volver al catálogo
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <ProductGallery images={images} name={product.name} />
            </Reveal>

            <Reveal delay={0.1} className="md:py-6">
              <div className="md:sticky md:top-28">
                <span className="text-[0.7rem] uppercase tracking-luxe text-coral">
                  {product.category}
                </span>
                <h1 className="editorial-title mt-4 text-balance text-5xl text-ink md:text-6xl">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                )}
                {!product.description && (
                  <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
                    Esta pieza ya hace parte del catálogo ISOLÉ. Estamos
                    completando sus imágenes y detalles para que puedas
                    descubrirla con la misma calma del showroom.
                  </p>
                )}

                <dl className="mt-10 space-y-5 border-t border-border pt-8">
                  {details.map((detail, index) => (
                    <div
                      key={detail.label}
                      className={`flex items-start justify-between gap-6 ${
                        index > 0 ? 'border-t border-border pt-5' : ''
                      }`}
                    >
                      <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                        {detail.label}
                      </dt>
                      <dd className="text-right text-sm text-ink">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10">
                  <a
                    href={whatsappLink(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 ease-luxe hover:bg-coral/90 sm:w-auto"
                  >
                    <WhatsAppIcon className="size-5" />
                    Consultar disponibilidad por WhatsApp
                  </a>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Te responderemos personalmente. También puedes visitarnos en
                    el showroom para verla y sentirla.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <Reveal className="mb-12 text-center">
            <span className="text-[0.7rem] uppercase tracking-luxe text-coral">
              También te puede gustar
            </span>
            <h2 className="editorial-title mt-4 text-4xl text-ink md:text-5xl">
              Continúa la historia
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-7">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <ProductCard
                  product={p}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <CtaLink href="/catalogo/todos-los-articulos" variant="outline">
              Ver todo el catálogo
            </CtaLink>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
