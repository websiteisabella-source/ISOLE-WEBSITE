import type { Metadata } from 'next'
import { CommunityGallery } from '@/components/site/community-gallery'
import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'
import { absoluteUrl, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: `Comunidad | ${SITE_NAME}`,
  description:
    'Mujeres reales, momentos reales: reels y publicaciones de la comunidad ISOLÉ.',
  alternates: {
    canonical: absoluteUrl('/comunidad'),
  },
}

export default function ComunidadPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-24">
        <CommunityGallery />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
