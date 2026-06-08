import Image from 'next/image'
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
    <main className="bg-[#080808] min-h-screen relative overflow-hidden">
      <Navbar />
      <Hero />
      
      {/* Background Notebook Anatomy texture covering from The Problem to the end */}
      <div className="relative w-full">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <Image
            src="/images/davinci_notebook_anatomy.jpg"
            alt=""
            fill
            className="object-cover object-top"
            style={{ opacity: 0.07, mixBlendMode: 'luminosity' }}
            sizes="100vw"
            priority
          />
          {/* Soft fade-in mask at the top of The Problem, and fade-out at the bottom */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080808] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080808] to-transparent" />
        </div>
        
        <div className="relative z-10">
          <TheProblem />
          <Features />
          <TheName />
          <Pricing />
          <FinalCTA />
          <LandingFooter />
        </div>
      </div>
    </main>
  )
}
