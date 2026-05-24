'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const painPoints = [
  {
    title: 'Your portfolio looks like three people built it.',
    body: "A design site here. A GitHub there. A LinkedIn that doesn't match either. Clients can't connect the dots.",
  },
  {
    title: "Clients don't know how to refer you.",
    body: "You're great at what you do — but explaining what you do takes a 10-minute conversation every time.",
  },
  {
    title: 'The tools are wrong for you.',
    body: 'Behance is for designers. GitHub is for devs. Substack is for writers. None of them are built for all of the above.',
  },
]

export default function TheProblem() {
  return (
    <section className="py-32 px-8 md:px-20 bg-black">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest uppercase text-white/30 font-body mb-8"
      >
        // The problem
      </motion.p>

      <BlurText
        text='"So... what exactly do you do?"'
        className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-4xl"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-sm font-heading italic text-white/30 mt-5 mb-20"
      >
        — Every potential client, ever.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {painPoints.map((point, i) => (
          <motion.div
            key={i}
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.15 }}
            className="liquid-glass rounded-[1.25rem] p-7 min-h-[200px] flex flex-col justify-between"
          >
            <p className="font-heading italic text-white text-xl leading-snug">{point.title}</p>
            <p className="text-sm font-body text-white/40 leading-relaxed mt-4">{point.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
