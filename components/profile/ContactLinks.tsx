'use client'

import { motion } from 'framer-motion'
import type { ProfileLink, ProfileLinkType } from '@/lib/types'

function LinkIcon({ type }: { type: ProfileLinkType }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true }
  switch (type) {
    case 'github':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common} fill="currentColor">
          <path d="M18.2 2H21l-6.5 7.4L22 22h-6.2l-4.9-6.4L5.3 22H2.5l7-8L2 2h6.3l4.4 5.8L18.2 2zm-1.1 18h1.7L7 3.8H5.2L17.1 20z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.2 8.2h4.6V24H.2V8.2zm7.5 0h4.4v2.2h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.5 3 5.5 7V24h-4.6v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V24H7.7V8.2z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...common} fill="currentColor">
          <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z" />
        </svg>
      )
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      )
  }
}

interface ContactLinksProps {
  links: ProfileLink[]
  contactEmail: string | null
}

export default function ContactLinks({ links, contactEmail }: ContactLinksProps) {
  if (links.length === 0 && !contactEmail) return null

  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
      className="flex flex-col items-center gap-5 mt-6"
    >
      {contactEmail && (
        <a
          href={`mailto:${contactEmail}`}
          className="bg-white text-black font-body text-sm font-medium rounded-full px-6 py-2.5 hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Get in touch
        </a>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link, i) => (
            <a
              key={`${link.type}-${i}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label={link.label}
              title={link.label}
            >
              <LinkIcon type={link.type} />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  )
}
