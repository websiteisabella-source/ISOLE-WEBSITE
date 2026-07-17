const DEFAULT_WHATSAPP_NUMBER = '521234567890'

export const SITE_NAME = 'ISOLÉ'
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  'https://www.instagram.com/isabellla.co/'

// Optional looping, muted hero video. When set, the Hero plays it on loop
// over the poster image. Leave unset to show the still image only.
export const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? ''

export const WHATSAPP_NUMBER =
  (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER).replace(
    /\D/g,
    '',
  ) || DEFAULT_WHATSAPP_NUMBER

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
