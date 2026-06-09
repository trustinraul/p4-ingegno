'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const freeFeatures = [
  'Public profile at ingegno.app/username',
  'Up to 2 visible projects',
  'Manual activity updates',
  'GitHub commit sync',
  'Ingegno badge in footer',
]

const proFeatures = [
  'Everything in Free',
  'Unlimited visible projects',
  'Remove Ingegno badge',
  'Priority support',
  'Custom domain (coming soon)',
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-8 md:px-20 bg-transparent">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-heading italic text-white text-5xl md:text-6xl leading-[0.9] max-w-3xl mb-16 text-center mx-auto"
        >
          Start free. Upgrade when you&apos;re ready.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto text-left">
        {/* Free */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="liquid-glass rounded-[1.25rem] p-8 flex flex-col justify-between"
        >
          <div>
            <div className="min-h-[80px]">
              <p className="text-sm font-body text-white/55 mb-2">Free</p>
              <p className="font-heading italic text-white text-5xl mb-1">€0</p>
              <p className="text-xs font-body text-white/55 mb-8">forever</p>
            </div>
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-body text-white/75">
                  <span className="text-white/45 flex-shrink-0 text-xs">—</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup"
            className="mt-8 text-center liquid-glass rounded-full px-6 py-3 text-sm font-body text-white hover:opacity-80 transition-opacity cursor-pointer block"
          >
            Get started free
          </Link>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="liquid-glass-strong rounded-[1.25rem] p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-5 right-5">
            <span className="text-xs font-body text-white/75 bg-white/10 px-3 py-1 rounded-full">
              Most popular
            </span>
          </div>

          <div>
            <div className="min-h-[80px]">
              <p className="text-sm font-body text-white/55 mb-2">Pro</p>
              <p className="font-heading italic text-5xl mb-1" style={{ color: '#8B5CF6' }}>€9</p>
              <p className="text-xs font-body text-white/55 mb-8">/month · or €79/year</p>
            </div>
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-body text-white/85">
                  <span className="text-white/75 flex-shrink-0 text-xs">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup"
            className="mt-8 text-center bg-white text-black rounded-full px-6 py-3 text-sm font-body font-medium hover:bg-white/90 transition-colors cursor-pointer block"
          >
            Get Pro →
          </Link>
        </motion.div>
      </div>
      </div>
    </section>
  )
}
