'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

export default function FinalCTA() {
  return (
    <section className="py-40 px-8 text-center bg-black flex flex-col items-center">
      <BlurText
        text="One URL. Everything you are."
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-3xl mb-6"
      />

      <motion.p
        initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        className="text-base font-body text-white/50 mb-10"
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
          className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-body font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
        >
          Claim your username
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M7 7h10v10" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}
