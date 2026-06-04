'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      {/* Logomark */}
      <div className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="font-heading italic text-white text-xl leading-none">i</span>
      </div>

      {/* Center nav pill */}
      <div className="liquid-glass rounded-full px-6 py-3 hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="#features" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#pricing" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="#about" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/discover" className="text-sm font-body text-white/70 hover:text-white transition-colors">
          Discover
        </Link>
        <Link
          href="/signup"
          className="bg-white text-black text-sm font-body font-medium px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors flex items-center gap-1 cursor-pointer"
        >
          Get your profile
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M7 7h10v10" />
          </svg>
        </Link>
      </div>

      {/* Invisible spacer for centering */}
      <div className="w-12 h-12 flex-shrink-0 opacity-0 pointer-events-none" />
    </nav>
  )
}
