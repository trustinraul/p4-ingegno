'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface DiscoverCardProps {
  profile: {
    username: string
    full_name: string | null
    avatar_url: string | null
    roles: string[] | null
  }
  recentUpdates: number
}

export default function DiscoverCard({ profile, recentUpdates }: DiscoverCardProps) {
  const initials = (profile.full_name ?? profile.username)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div whileHover={{ scale: 1.015 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
      <Link href={`/${profile.username}`} className="block liquid-glass rounded-[1.25rem] p-6 space-y-4 hover:border-white/20 transition-colors">
        <div className="flex items-center gap-4">
          <div className="liquid-glass rounded-full w-12 h-12 flex-shrink-0 overflow-hidden">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name ?? profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading italic text-white text-lg">{initials}</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-body text-white font-medium truncate">
              {profile.full_name ?? profile.username}
            </p>
            <p className="font-body text-white/40 text-sm truncate">@{profile.username}</p>
          </div>
        </div>

        {profile.roles && profile.roles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.roles.slice(0, 3).map((role) => (
              <span
                key={role}
                className="text-xs font-body px-2.5 py-0.5 rounded-full border border-white/10 text-white/50"
              >
                {role}
              </span>
            ))}
          </div>
        )}

        <div className="pt-1 border-t border-white/[0.06]">
          {recentUpdates > 0 ? (
            <span className="text-xs font-body text-emerald-400/70">
              ● {recentUpdates} update{recentUpdates > 1 ? 's' : ''} this week
            </span>
          ) : (
            <span className="text-xs font-body text-white/20">No recent activity</span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
