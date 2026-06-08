'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const features = [
  {
    title: 'Your identity, finally whole.',
    body: 'One page for everything you are. Projects, writing, skills, and a narrative that explains how it all connects — instead of hiding it.',
  },
  {
    title: 'Show your work as it happens.',
    body: 'Sync your GitHub commits automatically. Post manual updates. Your profile is alive — not a static snapshot from 2022.',
  },
  {
    title: 'A profile that matches your ambition.',
    body: 'Designed to be cinematic. Built to be fast. The tool finally looks as good as the work you put into it.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 px-8 md:px-20 bg-black">
      <BlurText
        text="Built for people who can't be put in a box."
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-4xl mb-20"
      />

      <div className="flex flex-col gap-4 max-w-4xl">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, x: -20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.12 }}
            className="liquid-glass rounded-[1rem] px-8 py-7 flex items-start gap-8"
          >
            <div
              className="w-px h-12 flex-shrink-0 mt-1"
              style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.5), transparent)' }}
            />
            <div>
              <p className="font-heading italic text-white text-2xl leading-snug mb-3">{feature.title}</p>
              <p className="text-sm font-body text-white/60 leading-relaxed max-w-xl">{feature.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
