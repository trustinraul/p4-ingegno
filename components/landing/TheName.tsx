'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const paragraphs = [
  'Leonardo da Vinci used the word ingegno to describe a quality he considered the highest form of human intelligence: the creative capacity to connect disciplines that others kept separate.',
  'He was a painter, an engineer, an anatomist, a musician, and a cartographer — not in spite of each other, but because of each other. The connections between fields were the source of his genius.',
  'Ingegno is built for people with that same quality — modern Da Vincis who refuse to pick a lane, and who deserve a tool that celebrates that complexity instead of flattening it.',
]

export default function TheName() {
  return (
    <section id="about" className="py-32 px-8 md:px-20 bg-transparent relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Column: Da Vinci Portrait glass card */}
        <div className="lg:col-span-5 w-full flex justify-center order-1 lg:order-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden liquid-glass-strong p-1 max-w-[360px] lg:max-w-full"
          >
            <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-white/[0.02]">
              <Image
                src="/images/davinci_portrait.jpeg"
                alt="Leonardo da Vinci - Self Portrait"
                fill
                className="object-cover"
                style={{
                  objectPosition: '50% 0%',
                  opacity: 0.5,
                  filter: 'grayscale(1) contrast(1.1)',
                  mixBlendMode: 'luminosity',
                  maskImage: 'radial-gradient(ellipse 70% 80% at 50% 45%, black 45%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 45%, black 45%, transparent 100%)',
                }}
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Text content */}
        <div className="lg:col-span-7 text-left order-2 lg:order-2">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
          >
            // The name
          </motion.p>

          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-heading italic text-white text-6xl mb-3"
          >
            ingegno
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm font-body text-white/30 mb-12"
          >
            /in·ˈjen·yo/ · Italian, Renaissance
          </motion.p>

          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
              className="text-base font-body text-white/65 leading-relaxed mb-5"
            >
              {para}
            </motion.p>
          ))}
        </div>

      </div>
    </section>
  )
}
