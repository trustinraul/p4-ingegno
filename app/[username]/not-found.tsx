import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="bg-black min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <p className="font-heading italic text-white/20 text-8xl mb-6">404</p>
      <p className="font-body text-white/40 text-lg mb-8">
        This profile doesn&apos;t exist or isn&apos;t public yet.
      </p>
      <Link
        href="/"
        className="liquid-glass rounded-full px-6 py-3 text-sm font-body text-white/60 hover:text-white transition-colors"
      >
        Go home
      </Link>
    </main>
  )
}
