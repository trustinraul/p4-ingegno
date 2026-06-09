import Link from 'next/link'

export default function ProfileNavbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      <Link href="/" className="font-heading italic text-white/45 text-sm hover:text-white/75 transition-colors">
        Ingegno
      </Link>
      <Link
        href="/signup"
        className="liquid-glass rounded-full px-5 py-2.5 text-sm font-body text-white/85 hover:text-white transition-colors flex items-center gap-2"
      >
        Claim your username
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </Link>
    </nav>
  )
}
