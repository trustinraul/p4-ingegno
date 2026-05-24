'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const features = [
  {
    number: '01',
    title: 'Your identity, finally whole.',
    body: 'One page for everything you are. Projects, writing, skills, and a narrative that explains how it all connects — instead of hiding it.',
  },
  {
    number: '02',
    title: 'Show your work as it happens.',
    body: 'Sync your GitHub commits automatically. Post manual updates. Your profile is alive — not a static snapshot from 2022.',
  },
  {
    number: '03',
    title: 'A profile that matches your ambition.',
    body: 'Designed to be cinematic. Built to be fast. The tool finally looks as good as the work you put into it.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 px-8 md:px-20 bg-black">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
      >
        // What Ingegno gives you
      </motion.p>

      <BlurText
        text="Built for people who can't be put in a box."
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-4xl mb-20"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.15 }}
            className="liquid-glass rounded-[1.25rem] p-7 min-h-[380px] flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-body text-white/20 mb-6">{feature.number}</p>
              <p className="font-heading italic text-white text-2xl leading-snug">{feature.title}</p>
            </div>
            <p className="text-sm font-body text-white/40 leading-relaxed">{feature.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
