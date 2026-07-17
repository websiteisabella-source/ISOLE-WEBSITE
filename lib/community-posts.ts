import syncedPosts from '@/public/data/community-posts.json'
import { cloudinaryImage } from './cloudinary-assets'
import { INSTAGRAM_URL } from './site'

export type CommunityPost = {
  id: string
  src: string
  alt: string
  href: string
  tag: string
  caption?: string
  timestamp?: string
}

const fallbackPosts: CommunityPost[] = [
  {
    id: 'fallback-community-1',
    src: cloudinaryImage('/images/community-1.png'),
    alt: 'Mujer riendo bajo la luz del sol con prenda de lino crema',
    href: INSTAGRAM_URL,
    tag: 'isolemomentos',
  },
  {
    id: 'fallback-community-2',
    src: cloudinaryImage('/images/community-2.png'),
    alt: 'Mujer con vestido coral tomando cafe en una terraza soleada',
    href: INSTAGRAM_URL,
    tag: 'isolestudio',
  },
  {
    id: 'fallback-community-3',
    src: cloudinaryImage('/images/community-3.png'),
    alt: 'Dos amigas caminando juntas al atardecer',
    href: INSTAGRAM_URL,
    tag: 'isolegirls',
  },
  {
    id: 'fallback-community-4',
    src: cloudinaryImage('/images/community-4.png'),
    alt: 'Mujer leyendo junto a la ventana con luz calida',
    href: INSTAGRAM_URL,
    tag: 'isolemomentos',
  },
  {
    id: 'fallback-community-5',
    src: cloudinaryImage('/images/community-5.png'),
    alt: 'Mujer girando con vestido coral en una azotea soleada',
    href: INSTAGRAM_URL,
    tag: 'isolestudio',
  },
  {
    id: 'fallback-community-6',
    src: cloudinaryImage('/images/community-6.png'),
    alt: 'Retrato calido de mujer sonriendo a la luz natural',
    href: INSTAGRAM_URL,
    tag: 'isolegirls',
  },
]

function isCommunityPost(post: unknown): post is CommunityPost {
  if (!post || typeof post !== 'object') return false

  const candidate = post as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.src === 'string' &&
    typeof candidate.alt === 'string' &&
    typeof candidate.href === 'string' &&
    typeof candidate.tag === 'string'
  )
}

const validSyncedPosts = Array.isArray(syncedPosts)
  ? syncedPosts.filter(isCommunityPost)
  : []

export const communityPosts =
  validSyncedPosts.length > 0 ? validSyncedPosts : fallbackPosts
