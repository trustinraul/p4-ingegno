'use client'

import { motion } from 'framer-motion'

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
    <section className="py-32 px-8 md:px-20 bg-transparent">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-white/45 font-body mb-8 text-center"
        >
          // The problem
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-heading italic text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] max-w-4xl text-center mx-auto"
        >
          &ldquo;So... what exactly do you do?&rdquo;
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm font-heading italic mt-5 mb-20 text-center"
          style={{ color: 'rgba(139,92,246,0.6)' }}
        >
          — Every potential client, ever.
        </motion.p>

        <div className="max-w-4xl w-full flex flex-col gap-16">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              className={`flex flex-col gap-3 ${i % 2 === 1 ? 'items-end text-right' : 'items-start text-left'}`}
            >
              <p className="font-heading italic text-white text-3xl md:text-4xl leading-tight max-w-2xl" style={{ textWrap: 'balance' } as React.CSSProperties}>
                &ldquo;{point.title}&rdquo;
              </p>
              <p className="text-sm text-white/75 font-body max-w-lg leading-relaxed">
                {point.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
