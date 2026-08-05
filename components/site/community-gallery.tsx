import Image from 'next/image'
import { communityPosts, type CommunityPost } from '@/lib/community-posts'
import { cloudinaryImage } from '@/lib/cloudinary-assets'
import { INSTAGRAM_URL } from '@/lib/site'
import { InstagramIcon } from './icons'
import { InstagramPostEmbed } from './instagram-post-embed'
import { Reveal } from './reveal'

function CommunityImage({ post }: { post: CommunityPost }) {
  const imageClassName =
    'object-cover transition-transform duration-[1100ms] ease-luxe group-hover:scale-110'

  if (/^https?:\/\//.test(post.src)) {
    return (
      <img
        src={post.src}
        alt={post.alt}
        className={`size-full ${imageClassName}`}
      />
    )
  }

  return (
    <Image
      src={post.src}
      alt={post.alt}
      fill
      sizes="(max-width: 768px) 50vw, 18vw"
      className={imageClassName}
    />
  )
}

export function CommunityGallery() {
  return (
    <section id="comunidad" className="community-clean-bg brand-organic bg-cream px-7 pt-8 pb-16 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 flex flex-col items-center text-center md:mb-12">
          <span className="manual-kicker text-coral">
            Comunidad
          </span>
          <h2 className="editorial-title mt-3 max-w-[18rem] text-balance text-[2.65rem] leading-[0.95] text-ink md:max-w-2xl md:text-6xl">
            Mujeres reales, momentos reales
          </h2>
          <p className="brand-subtitle mt-3 text-2xl leading-none text-coral md:text-3xl">
            comunidad ISOLÉ
          </p>
          <span
            className="mt-4 hidden h-1 w-24 rounded-full bg-gradient-to-r from-coral via-petal to-lavender md:block"
            aria-hidden="true"
          />
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[0.64rem] font-medium text-ink/75 transition-colors duration-500 hover:text-coral md:mt-6 md:text-sm md:font-semibold md:text-coral md:hover:text-lavender"
          >
            <InstagramIcon className="size-3.5 md:size-5" />
            ISOLÉ
          </a>
        </Reveal>

        <div className="mx-auto grid max-w-[22rem] grid-cols-3 gap-2 md:max-w-none md:gap-3">
          {communityPosts.map((post, i) => (
            <Reveal
              key={post.id}
              delay={i * 0.06}
              className="col-span-1"
            >
              {i === 0 ? (
                <InstagramPostEmbed
                  embedUrl="https://www.instagram.com/p/DY-Psx0IFrh/embed/"
                  previewAlt="Reel de ISOLÉ con collar dorado y top blanco"
                  previewSrc={cloudinaryImage('/images/isabella-reel-dy-psx0ifrh.jpg')}
                  toggleId="isabella-reel-dy-psx0ifrh"
                />
              ) : i === 1 ? (
                <InstagramPostEmbed
                  embedUrl="https://www.instagram.com/p/DXsbQTfDtvU/embed/"
                  previewAlt="Reel de ISOLÉ con outfit azul en tienda"
                  previewSrc={cloudinaryImage('/images/isabella-reel-dxsbqtfdtu.jpg')}
                  toggleId="isabella-reel-dxsbqtfdtu"
                />
              ) : i === 2 ? (
                <InstagramPostEmbed
                  embedUrl="https://www.instagram.com/p/DXhJ5cyDnqh/embed/"
                  previewAlt="Reel de ISOLÉ con pañoleta floral roja"
                  previewSrc={cloudinaryImage('/images/isabella-reel-dxhj5cydnqh.jpg')}
                  toggleId="isabella-reel-dxhj5cydnqh"
                />
              ) : i === 3 ? (
                <InstagramPostEmbed
                  embedUrl="https://www.instagram.com/p/DWz4FBuDGbK/embed/"
                  previewAlt="Reel de ISOLÉ con outfit azul en sala"
                  previewSrc={cloudinaryImage('/images/isabella-reel-dwz4fbudgbk.jpg')}
                  toggleId="isabella-reel-dwz4fbudgbk"
                />
              ) : i === 4 ? (
                <InstagramPostEmbed
                  embedUrl="https://www.instagram.com/p/DSxSEnRjdSO/embed/"
                  previewAlt="Reel de ISOLÉ con dos mujeres en exterior"
                  previewSrc={cloudinaryImage('/images/isabella-reel-dsksenrjdso.jpg')}
                  toggleId="isabella-reel-dsksenrjdso"
                />
              ) : i === 5 ? (
                <InstagramPostEmbed
                  embedUrl="https://www.instagram.com/p/DUrHgMNjtCH/embed/"
                  previewAlt="Reel de ISOLÉ con torta y flores"
                  previewSrc={cloudinaryImage('/images/isabella-reel-durhgmnjtch.jpg')}
                  toggleId="isabella-reel-durhgmnjtch"
                />
              ) : (
                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver publicacion de Instagram con #${post.tag}`}
                  className="group relative block aspect-[9/16] overflow-hidden rounded-sm border border-coral/10 bg-muted shadow-[0_1rem_2.4rem_rgba(46,37,33,0.08)]"
                >
                  <CommunityImage post={post} />
                  <div className="absolute inset-0 flex items-center justify-center bg-coral/0 opacity-0 transition-all duration-500 group-hover:bg-coral/20 group-hover:opacity-100">
                    <InstagramIcon className="size-7 text-cream" />
                  </div>
                  <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate bg-cream/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-luxe text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    #{post.tag}
                  </span>
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
