'use client'

import { motion } from 'framer-motion'

interface ProfileNarrativeProps {
  narrative: string | null
}

export default function ProfileNarrative({ narrative }: ProfileNarrativeProps) {
  if (!narrative) return null

  return (
    <section className="py-32 px-8 md:px-20 bg-black">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-white/30 font-body mb-10"
        >
          // About
        </motion.p>

        <motion.p
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="font-heading italic text-white text-2xl md:text-3xl leading-[1.45]"
        >
          {narrative}
        </motion.p>
      </div>
    </section>
  )
}
