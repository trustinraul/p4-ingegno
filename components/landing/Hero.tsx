'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const fadeUp = {
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-8 text-center">
      {/* Wireframe geometric background */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <svg
          width="700"
          height="700"
          viewBox="0 0 700 700"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
          style={{ animation: 'rotate3d 60s linear infinite' }}
        >
          <polygon points="350,80 560,260 490,500 210,500 140,260" />
          <polygon points="350,80 560,260 620,420 350,620 80,420 140,260" />
          <line x1="350" y1="80" x2="350" y2="620" />
          <line x1="560" y1="260" x2="80" y2="420" />
          <line x1="140" y1="260" x2="620" y2="420" />
          <line x1="490" y1="500" x2="350" y2="80" />
          <line x1="210" y1="500" x2="350" y2="80" />
          <circle cx="350" cy="350" r="280" strokeDasharray="4 8" />
          <circle cx="350" cy="350" r="200" strokeDasharray="2 12" />
          <ellipse cx="350" cy="350" rx="280" ry="100" />
          <ellipse cx="350" cy="350" rx="100" ry="280" />
        </svg>
      </div>

      {/* Da Vinci Codex flight sketch — upper-right ghost watermark */}
      <motion.div
        className="absolute top-0 right-0 w-80 h-64 pointer-events-none select-none"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 1.5 }}
        aria-hidden="true"
      >
        <Image
          src="/images/davinci_codex_flight.jpg"
          alt=""
          fill
          className="object-cover object-top"
          style={{ opacity: 0.025, mixBlendMode: 'luminosity' }}
          sizes="320px"
        />
      </motion.div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto pt-32">
        {/* Beta badge */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="liquid-glass rounded-full px-5 py-2 flex items-center gap-3">
            <span className="text-xs font-body font-medium text-white/90 bg-white/10 px-2 py-0.5 rounded-full">
              Beta
            </span>
            <span className="text-sm font-body text-white/60">
              Now in early access — claim your username
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <BlurText
          text="Your life's work. One URL."
          delay={0.4}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px] max-w-3xl text-center"
        />

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
          className="text-base md:text-lg text-white/60 font-body font-light max-w-lg leading-relaxed mt-5"
        >
          One elegant page that holds your projects, your writing, your skills, and your story — built for the people who can&apos;t be put in a box.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
          className="flex items-center gap-5 mt-2"
        >
          <Link
            href="/signup"
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-body font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            Claim your username
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </Link>
          <Link
            href="/signup"
            className="text-sm font-body text-white/50 hover:text-white/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            See how it works
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Preview card */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 1.1 }}
          className="liquid-glass rounded-[1.5rem] p-1 mt-6 w-full max-w-sm"
        >
          <div className="bg-white/[0.03] rounded-[1.25rem] p-6 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-heading italic text-white text-2xl">L</span>
            </div>
            <span className="font-heading italic text-white text-2xl">Leonardo</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Painter', 'Engineer', 'Anatomist'].map((role) => (
                <span
                  key={role}
                  className="liquid-glass rounded-full px-3 py-1 text-xs font-body text-white/70"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 1.3 }}
          className="flex items-center gap-4 mt-4"
        >
          <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-3">
            <span className="text-xs font-body text-white/30">Profiles already live</span>
            <div className="flex gap-3">
              {['Marco', 'Sofia', 'Lena', 'Arjun', 'Mila'].map((name) => (
                <span key={name} className="text-xs font-heading italic text-white/50">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
