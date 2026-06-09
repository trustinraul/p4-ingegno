'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
        {/* Logomark */}
        <div className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-heading italic text-white text-xl leading-none">i</span>
        </div>

        {/* Center nav pill — desktop only */}
        <div className="liquid-glass rounded-full px-6 py-3 hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-body text-white/85 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="#features" className="text-sm font-body text-white/85 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-body text-white/85 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#about" className="text-sm font-body text-white/85 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/discover" className="text-sm font-body text-white/85 hover:text-white transition-colors">
            Discover
          </Link>
          <Link
            href="/signup"
            className="bg-white text-black text-sm font-body font-medium px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            Claim your username
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </Link>
        </div>

        {/* Right side: hamburger on mobile, invisible spacer on desktop */}
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <button
            className="md:hidden liquid-glass w-12 h-12 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/85">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/85">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden bg-black/50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden liquid-glass rounded-[1.25rem] px-6 py-5 flex flex-col"
            >
              {[
                { href: '#features', label: 'Features' },
                { href: '#pricing', label: 'Pricing' },
                { href: '#about', label: 'About' },
                { href: '/discover', label: 'Discover' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-body text-white/85 hover:text-white transition-colors py-3 border-b border-white/[0.06] last:border-b-0"
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="bg-white text-black text-sm font-body font-medium px-5 py-3 rounded-full hover:bg-white/90 transition-colors flex items-center justify-center gap-2 w-full focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  Claim your username
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
