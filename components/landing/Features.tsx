'use client'

import Image from 'next/image'
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
    <section id="features" className="py-32 px-8 md:px-20 bg-transparent">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Premium framed Vitruvian Man glass card */}
        <div className="lg:col-span-5 w-full flex justify-center order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden liquid-glass-strong p-1 max-w-[360px] lg:max-w-full"
          >
            <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-white/[0.02]">
              <Image
                src="/images/davinci_vitruvian_man.jpg"
                alt="Leonardo da Vinci - Vitruvian Man"
                fill
                className="object-cover object-center"
                style={{
                  opacity: 0.55,
                  filter: 'grayscale(1) contrast(1.1)',
                  mixBlendMode: 'luminosity',
                  maskImage: 'radial-gradient(ellipse 75% 85% at 50% 50%, black 50%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 75% 85% at 50% 50%, black 50%, transparent 100%)'
                }}
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Title and vertical list of features */}
        <div className="lg:col-span-7 flex flex-col gap-10 text-left order-1 lg:order-2">
          <BlurText
            text="Built for people who can't be put in a box."
            className="font-heading italic text-white text-5xl md:text-6xl leading-[0.9] max-w-xl text-left"
          />

          <div className="flex flex-col divide-y divide-white/[0.06] w-full">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.12 }}
                className="py-7 flex items-start gap-8"
              >
                <div
                  className="w-px h-12 flex-shrink-0 mt-1"
                  style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.5), transparent)' }}
                />
                <div>
                  <p className="font-heading italic text-white text-2xl leading-snug mb-3">{feature.title}</p>
                  <p className="text-sm font-body text-white/75 leading-relaxed">{feature.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
