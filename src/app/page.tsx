import { Header } from '@/presentation/components/layout/header'
import { Footer } from '@/presentation/components/layout/footer'
import { HeroSection } from '@/presentation/components/home/hero-section'
import { FeaturedServices } from '@/presentation/components/home/featured-services'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturedServices />
      </main>

      <Footer />
    </div>
  )
}
