'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/actions/auth'
import { HomeIcon, FolderIcon, SettingsIcon, CompassIcon, MenuIcon } from '@/components/ui/icons'

interface DashboardNavProps {
  username: string
  isPublic: boolean
  isCollapsed: boolean
  onToggle: () => void
}

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
]

export default function DashboardNav({ username, isPublic, isCollapsed, onToggle }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'fixed z-40 bg-black flex transition-all duration-200',
        // Mobile: full-width bottom bar in thumb reach (safe-area added on top of the 64px touch row)
        'inset-x-0 bottom-0 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] flex-row border-t border-white/[0.08]',
        // Desktop (md+): left sidebar, unchanged
        'md:inset-x-auto md:bottom-auto md:left-0 md:top-0 md:h-screen md:flex-col md:border-t-0 md:border-r',
        'md:w-16',
        !isCollapsed && 'md:w-64'
      )}
    >
      {/* Header — desktop only */}
      <div className={cn('hidden md:flex items-center mb-4 md:mb-10 px-4 pt-6 justify-center', !isCollapsed && 'md:justify-between')}>
        {!isCollapsed && (
          <Link href="/" className="hidden md:block group">
            <span className="font-heading italic text-white text-2xl group-hover:text-white/75 transition-colors">Ingegno</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-white/45 hover:text-white/85 transition-colors rounded-lg hover:bg-white/5 hidden md:block"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Main nav — `contents` on mobile so links become direct flex children of the bottom bar */}
      <div className="contents md:flex md:flex-col md:gap-1 md:flex-1 md:px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 px-3 py-2 rounded-2xl text-sm font-body transition-colors',
                'justify-center',
                'md:flex-none md:flex-row md:gap-3 md:py-2.5 md:rounded-full',
                !isCollapsed && 'md:justify-start',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:text-white/85'
              )}
            >
              {/* Bigger, label-less icon on the mobile bar; back to 16px in the desktop sidebar */}
              <Icon className="shrink-0 w-[22px] h-[22px] md:w-4 md:h-4" />
              {/* Desktop label — only when sidebar is expanded */}
              {!isCollapsed && <span className="hidden md:inline">{label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Discover + bottom actions — `contents` on mobile; the divider/actions are desktop-only */}
      <div className="contents md:flex md:flex-col md:gap-1 md:px-2 md:pb-6 md:border-t md:border-white/[0.06] md:pt-4 md:mt-4">
        <Link
          href="/discover"
          title="Discover"
          aria-label="Discover"
          className={cn(
            'flex flex-1 flex-col items-center gap-1 px-3 py-2 rounded-2xl text-sm font-body transition-colors',
            'justify-center',
            'md:flex-none md:flex-row md:gap-3 md:py-2.5 md:rounded-full',
            !isCollapsed && 'md:justify-start',
            pathname === '/discover'
              ? 'bg-white/10 text-white'
              : 'text-white/55 hover:text-white/85'
          )}
        >
          {/* Bigger, label-less icon on the mobile bar; back to 16px in the desktop sidebar */}
          <CompassIcon className="shrink-0 w-[22px] h-[22px] md:w-4 md:h-4" />
          {/* Desktop label — only when sidebar is expanded */}
          {!isCollapsed && <span className="hidden md:inline">Discover</span>}
        </Link>

        {!isCollapsed && username && (
          <Link
            href={`/${username}`}
            target="_blank"
            className="hidden md:flex px-3 py-2 text-xs font-body text-white/50 hover:text-white/75 transition-colors items-center gap-1"
          >
            View profile →
          </Link>
        )}

        {/* Sign out — desktop only; on mobile it lives in Settings to avoid accidental taps */}
        <form action={signOut} className="hidden md:block">
          <button
            type="submit"
            title="Sign out"
            aria-label="Sign out"
            className="px-3 py-2 text-xs font-body text-white/50 hover:text-white/75 transition-colors w-full text-left"
          >
            {isCollapsed ? '→' : 'Sign out'}
          </button>
        </form>
      </div>
    </nav>
  )
}
