'use client'

import { motion } from 'framer-motion'
import { GitHubIcon } from '@/components/ui/icons'
import type { ActivityItem } from '@/lib/types'

interface ActivityFeedProps {
  activity: ActivityItem[]
  profile: {
    avatar_url: string | null
    full_name: string
  }
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function ActivityFeed({ activity, profile }: ActivityFeedProps) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (activity.length === 0) return null

  return (
    <section className="py-24 px-8 md:px-20 bg-black">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-white/30 font-body mb-10"
        >
          // Activity
        </motion.p>

        <div className="space-y-3">
          {activity.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.07 }}
              className="liquid-glass rounded-[1rem] p-5"
            >
              {item.type === 'github_commit' ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <GitHubIcon className="text-white/40 flex-shrink-0 w-4 h-4" />
                    <span className="text-sm font-body text-white/40">{item.repo_name}</span>
                    <span className="text-xs font-body text-white/20 ml-auto">
                      {getRelativeTime(item.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-body text-white/70 leading-relaxed pl-7">
                    {item.content}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-heading italic text-white/60">{initials}</span>
                      </div>
                    )}
                    <span className="text-sm font-body text-white/40">Posted an update</span>
                    <span className="text-xs font-body text-white/20 ml-auto">
                      {getRelativeTime(item.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-body text-white/70 leading-relaxed pl-8">
                    {item.content}
                  </p>
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt="Update"
                      className="mt-4 rounded-[0.75rem] object-cover max-h-64 ml-8"
                      style={{ maxWidth: 'calc(100% - 2rem)' }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
