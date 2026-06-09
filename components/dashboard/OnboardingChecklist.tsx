'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, type ReactNode } from 'react'

interface OnboardingChecklistProps {
  hasName: boolean
  hasProjects: boolean
  isPublic: boolean
  username: string
  variant?: 'banner' | 'bare'
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

export default function OnboardingChecklist({ hasName, hasProjects, isPublic, username, variant = 'bare' }: OnboardingChecklistProps) {
  const done = [hasName, hasProjects, isPublic]
  const count = done.filter(Boolean).length

  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDismissed(localStorage.getItem('ingegno:onboarding-celebrated') === '1')
  }, [])

  // Owns the banner spacing so that returning null leaves no empty gap in the parent.
  const wrap = (node: ReactNode) =>
    variant === 'banner' ? <div className="px-8 pt-8 pb-2">{node}</div> : node

  if (count === 3) {
    if (!mounted) return null
    if (dismissed) return null

    return wrap(
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative border border-white/[0.08] rounded-[1.25rem] p-7 max-w-md"
      >
        <button
          aria-label="Dismiss"
          onClick={() => {
            localStorage.setItem('ingegno:onboarding-celebrated', '1')
            setDismissed(true)
          }}
          className="absolute top-4 right-5 text-white/30 hover:text-white/60 transition-colors text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded"
        >
          ×
        </button>

        <div className="flex items-start gap-4">
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border border-violet-500/60 bg-violet-500/15 mt-[2px]">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path
                d="M1.5 4.5L3.5 6.5L7.5 2.5"
                stroke="rgb(167,139,250)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-heading italic text-white text-xl leading-snug">You're live.</p>
            <p className="text-sm font-body text-white/60">
              Your profile is published and ready to share.
            </p>
            <Link
              href={`/${username}`}
              target="_blank"
              className="text-sm font-body text-violet-400/75 hover:text-violet-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded w-fit"
            >
              View your profile →
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return wrap(
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
