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
    <section id="about" className="py-32 px-8 md:px-20 bg-black relative overflow-hidden">
      {/* Decorative large "i" */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-heading italic text-white"
          style={{ fontSize: '22rem', opacity: 0.025, lineHeight: 1 }}
        >
          i
        </span>
      </div>

      {/* Da Vinci Vitruvian Man — right-side decorative layer */}
      <motion.div
        className="absolute right-0 top-0 h-full w-1/2 pointer-events-none select-none"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <Image
          src="/images/davinci_vitruvian_man.jpg"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.04, mixBlendMode: 'luminosity' }}
          sizes="50vw"
        />
      </motion.div>

      <div className="relative z-10 max-w-2xl">
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
            className="text-base font-body text-white/50 leading-relaxed mb-5"
          >
            {para}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
