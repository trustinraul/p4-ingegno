'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

interface ProfileHeroProps {
  profile: {
    full_name: string
    tagline: string | null
    roles: string[] | null
    avatar_url: string | null
  }
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-8 text-center">
      {/* Subtle radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Avatar */}
        <motion.div
          initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="liquid-glass rounded-full p-1 w-32 h-32"
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-heading italic text-white text-3xl">{initials}</span>
            </div>
          )}
        </motion.div>

        {/* Name */}
        <BlurText
          text={profile.full_name}
          delay={0.2}
          className="font-heading italic text-white text-6xl md:text-7xl lg:text-[5rem] tracking-[-3px]"
        />

        {/* Tagline */}
        {profile.tagline && (
          <motion.p
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
            className="text-lg text-white/50 font-body font-light mt-4 max-w-lg"
          >
            {profile.tagline}
          </motion.p>
        )}

        {/* Roles */}
        {(profile.roles?.length ?? 0) > 0 && (
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.65 }}
            className="flex flex-wrap justify-center gap-2 mt-2"
          >
            {(profile.roles ?? []).map((role) => (
              <span
                key={role}
                className="liquid-glass rounded-full px-4 py-1.5 text-sm font-body text-white/70"
              >
                {role}
              </span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ animation: 'bounce 2s infinite' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/15"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  )
}
