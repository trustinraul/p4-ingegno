'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface OnboardingChecklistProps {
  hasName: boolean
  hasProjects: boolean
  isPublic: boolean
}

const steps = [
  {
    id: 'name',
    label: 'Add your profile info',
    href: '/dashboard/profile',
  },
  {
    id: 'projects',
    label: 'Add your first project',
    href: '/dashboard/projects',
  },
  {
    id: 'public',
    label: 'Make your profile public',
    href: '/dashboard/profile',
  },
]

export default function OnboardingChecklist({ hasName, hasProjects, isPublic }: OnboardingChecklistProps) {
  const done = [hasName, hasProjects, isPublic]
  const count = done.filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="border border-white/[0.08] rounded-[1.25rem] p-7 max-w-md"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="font-heading italic text-white text-xl">Get your profile live</p>
        <span className="text-sm font-body text-white/40">{count} / 3</span>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/[0.06] rounded-full mb-7 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-violet-500/60"
          initial={{ width: 0 }}
          animate={{ width: `${(count / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, i) => {
          const isDone = done[i]
          return (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-colors ${
                  isDone
                    ? 'border-violet-500/60 bg-violet-500/15'
                    : 'border-white/15 bg-transparent'
                }`}
              >
                {isDone && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                    <path
                      d="M1.5 4.5L3.5 6.5L7.5 2.5"
                      stroke="rgb(167,139,250)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <p className={`flex-1 text-sm font-body leading-snug transition-colors ${
                isDone ? 'text-white/35 line-through decoration-white/20' : 'text-white/80'
              }`}>
                {step.label}
              </p>

              {!isDone && (
                <Link
                  href={step.href}
                  className="text-xs font-body text-violet-400/75 hover:text-violet-300 transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded"
                >
                  Go →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
