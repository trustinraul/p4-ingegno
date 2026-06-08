import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import TheProblem from '@/components/landing/TheProblem'
import Features from '@/components/landing/Features'
import TheName from '@/components/landing/TheName'
import Pricing from '@/components/landing/Pricing'
import FinalCTA from '@/components/landing/FinalCTA'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <main className="bg-[#080808] min-h-screen">
      <Navbar />
      <Hero />
      <TheProblem />
      <Features />
      <TheName />
      <Pricing />
      <FinalCTA />
      <LandingFooter />
    </main>
  )
}
