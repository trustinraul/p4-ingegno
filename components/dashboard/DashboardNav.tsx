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
        'fixed left-0 top-0 h-screen border-r border-white/[0.08] flex flex-col bg-black z-40 transition-all duration-200',
        'w-16',
        !isCollapsed && 'md:w-64'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center mb-4 md:mb-10 px-4 pt-6 justify-center', !isCollapsed && 'md:justify-between')}>
        {!isCollapsed && (
          <Link href="/dashboard" className="hidden md:block">
            <span className="font-heading italic text-white text-2xl">Ingegno</span>
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

      {/* Main nav */}
      <div className="flex flex-col gap-1 flex-1 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-sm font-body transition-colors',
                'justify-center',
                'md:flex-row md:gap-3 md:py-2.5 md:rounded-full',
                !isCollapsed && 'md:justify-start',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:text-white/85'
              )}
            >
              <Icon className="shrink-0" />
              {/* Mobile label — always visible below icon */}
              <span className="md:hidden text-[10px] leading-tight">{label}</span>
              {/* Desktop label — only when sidebar is expanded */}
              {!isCollapsed && <span className="hidden md:inline">{label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Discover + bottom actions */}
      <div className="flex flex-col gap-1 px-2 pb-6 border-t border-white/[0.06] pt-4 mt-4">
        <Link
          href="/discover"
          title="Discover"
          aria-label="Discover"
          className={cn(
            'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-sm font-body transition-colors',
            'justify-center',
            'md:flex-row md:gap-3 md:py-2.5 md:rounded-full',
            !isCollapsed && 'md:justify-start',
            pathname === '/discover'
              ? 'bg-white/10 text-white'
              : 'text-white/55 hover:text-white/85'
          )}
        >
          <CompassIcon className="shrink-0" />
          {/* Mobile label — always visible below icon */}
          <span className="md:hidden text-[10px] leading-tight">Discover</span>
          {/* Desktop label — only when sidebar is expanded */}
          {!isCollapsed && <span className="hidden md:inline">Discover</span>}
        </Link>

        {!isCollapsed && username && (
          <Link
            href={`/${username}`}
            target="_blank"
            className="hidden md:flex px-3 py-2 text-xs font-body text-white/45 hover:text-white/75 transition-colors items-center gap-1"
          >
            View profile →
          </Link>
        )}

        <form action={signOut}>
          <button
            type="submit"
            title="Sign out"
            aria-label="Sign out"
            className="px-3 py-2 text-xs font-body text-white/45 hover:text-white/75 transition-colors w-full text-center md:text-left"
          >
            {/* Mobile: icon + tiny label stacked */}
            <span className="md:hidden flex flex-col items-center gap-0.5">
              <span>→</span>
              <span className="text-[10px] leading-tight">Sign out</span>
            </span>
            {/* Desktop: text only, respects collapse */}
            <span className="hidden md:inline">{isCollapsed ? '→' : 'Sign out'}</span>
          </button>
        </form>
      </div>
    </nav>
  )
}
