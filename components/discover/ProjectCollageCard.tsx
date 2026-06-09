'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectCollageCardProps {
  collage: {
    image_urls: string[]
    created_at: string
  }
  project: {
    name: string
  }
  author: {
    username: string
    full_name: string | null
    avatar_url: string | null
  }
}

export default function ProjectCollageCard({ collage, project, author }: ProjectCollageCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fading, setFading] = useState(false)

  const initials = (author.full_name ?? author.username)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    if (collage.image_urls.length <= 1) return

    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % collage.image_urls.length)
        setFading(false)
      }, 300)
    }, 2500)

    return () => clearInterval(interval)
  }, [collage.image_urls.length])

  return (
    <Link
      href={`/${author.username}`}
      className="block rounded-[1.25rem] overflow-hidden liquid-glass group cursor-pointer"
    >
      <div className="relative w-full overflow-hidden">
        <div
          className="transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <Image
            src={collage.image_urls[currentIndex]}
            alt={project.name}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>

        {/* Dot indicators */}
        {collage.image_urls.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {collage.image_urls.map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-colors duration-200"
                style={{ background: i === currentIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}
              />
            ))}
          </div>
        )}

        {/* Hover overlay */}
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

      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-body text-white/75 leading-relaxed">{project.name}</p>
          <span className="text-[10px] font-body text-violet-400/80 bg-violet-400/10 border border-violet-400/20 rounded-full px-2 py-0.5">
            Launched
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 shrink-0">
            {author.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.full_name ?? author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading italic text-white text-[7px]">{initials}</span>
              </div>
            )}
          </div>
          <span className="text-xs font-body text-white/55">@{author.username}</span>
        </div>
      </div>
    </Link>
  )
}
