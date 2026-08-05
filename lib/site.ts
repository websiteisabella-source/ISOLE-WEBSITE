import { cloudinaryVideos } from './cloudinary-videos'

const DEFAULT_WHATSAPP_NUMBER = '521234567890'

export const SITE_NAME = 'ISOLÉ'
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tu-dominio.com'
).replace(/\/$/, '')
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  'https://www.instagram.com/isabellla.co/'

// Looping, muted hero video. The env var can override the default showroom video.
export const HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? cloudinaryVideos.barrancabermeja

export const HERO_VIDEO_MIME_TYPE = 'video/mp4'

export const WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER).replace(
    /\D/g,
    '',
  ) || DEFAULT_WHATSAPP_NUMBER

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function absoluteUrl(path = '/') {
  return new URL(path, `${SITE_URL}/`).toString()
}
