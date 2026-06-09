'use client'

import Link from 'next/link'
import Image from 'next/image'

interface DiscoverCardProps {
  update: {
    id: string
    content: string
    image_url: string
    created_at: string
  }
  author: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function DiscoverCard({ update, author }: DiscoverCardProps) {
  const caption = update.content.length > 120
    ? update.content.slice(0, 120).trimEnd() + '…'
    : update.content

  const initials = (author.full_name ?? author.username)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link
      href={`/${author.username}`}
      className="block rounded-[1.25rem] overflow-hidden liquid-glass group cursor-pointer"
    >
      <div className="relative w-full overflow-hidden">
        <Image
          src={update.image_url}
          alt={caption}
          width={600}
          height={400}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          unoptimized
        />
        {/* Hover overlay with author */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 shrink-0">
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={author.full_name ?? author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading italic text-white text-[8px]">{initials}</span>
                </div>
              )}
            </div>
            <span className="text-xs font-body text-white/80">@{author.username}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs font-body text-white/75 leading-relaxed">{caption}</p>
      </div>
    </Link>
  )
}
