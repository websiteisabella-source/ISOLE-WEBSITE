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
    <section id="comunidad" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-center text-center">
          <span className="text-[0.7rem] uppercase tracking-luxe text-coral">
            Comunidad
          </span>
          <h2 className="editorial-title mt-4 max-w-2xl text-balance text-4xl text-ink md:text-6xl">
            Mujeres reales, momentos reales
          </h2>
          <p className="brand-subtitle mt-3 text-3xl text-coral">
            comunidad ISOLÉ
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-500 hover:text-coral"
          >
            <InstagramIcon className="size-5" />
            ISOLÉ
          </a>
        </Reveal>

        <div className="grid grid-cols-3 gap-1.5 md:gap-3">
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
                  className="group relative block aspect-[9/16] overflow-hidden rounded-sm bg-muted"
                >
                  <CommunityImage post={post} />
                  <div className="absolute inset-0 flex items-center justify-center bg-coral/0 opacity-0 transition-all duration-500 group-hover:bg-ink/25 group-hover:opacity-100">
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
