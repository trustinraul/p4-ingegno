'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-40 px-8 text-center bg-transparent flex flex-col items-center">
      {/* Radial glow — upward violet bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 70%)',
          zIndex: 2,
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-3xl mb-6"
        >
          One URL. Everything you are.
        </motion.h2>

        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          className="text-base font-body text-white/75 mb-10"
        >
          Join the Da Vincis who&apos;ve already claimed their name.
        </motion.p>

        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
        >
          <Link
            href="/signup"
            className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-body font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            Claim your username
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
