import type { Metadata } from 'next'
import { EditorialSection } from '@/components/site/editorial-section'
import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'
import { absoluteUrl, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Nuestra historia',
  description:
    `Conoce la casa ${SITE_NAME}: una marca de moda femenina natural nacida del deseo de vestir con calma, luz interior y materiales nobles.`,
  alternates: {
    canonical: absoluteUrl('/historia'),
  },
}

export default function HistoriaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">
        <EditorialSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
