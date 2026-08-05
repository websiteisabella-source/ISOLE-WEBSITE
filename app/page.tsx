import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { MasonryGallery } from '@/components/site/masonry-gallery'
import { NewArrivals } from '@/components/site/new-arrivals'
import { Footer } from '@/components/site/footer'
import { WhatsAppFloat } from '@/components/site/whatsapp-float'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="brand-flow">
          <MasonryGallery />
          <NewArrivals />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
