import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { EditorialSection } from '@/components/site/editorial-section'
import { MasonryGallery } from '@/components/site/masonry-gallery'
import { NewArrivals } from '@/components/site/new-arrivals'
import { QuoteSection } from '@/components/site/quote-section'
import { CommunityGallery } from '@/components/site/community-gallery'
import { Footer } from '@/components/site/footer'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="brand-flow">
          <EditorialSection />
          <MasonryGallery />
          <NewArrivals />
        </div>
        <QuoteSection />
        <CommunityGallery />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
