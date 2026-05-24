'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/actions/auth'

interface DashboardNavProps {
  username: string
  isPublic: boolean
}

const links = [
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/updates', label: 'Updates' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function DashboardNav({ username, isPublic }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r border-white/[0.08] flex flex-col p-6 bg-black z-40">
      <div className="mb-10">
        <Link href="/dashboard">
          <span className="font-heading italic text-white text-2xl">Ingegno</span>
        </Link>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'px-4 py-2.5 rounded-full text-sm font-body transition-colors',
              pathname === link.href
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-6">
        {username && (
          <Link
            href={`/${username}`}
            target="_blank"
            className="px-4 py-2 text-xs font-body text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            View profile →
          </Link>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-body text-white/30 hover:text-white/60 transition-colors w-full text-left"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  )
}
