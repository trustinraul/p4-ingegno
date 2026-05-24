import Link from 'next/link'

interface ProfileFooterProps {
  plan: 'free' | 'pro'
}

export default function ProfileFooter({ plan }: ProfileFooterProps) {
  if (plan === 'pro') {
    return <footer className="h-16 bg-black" />
  }

  return (
    <footer className="py-8 px-8 bg-black flex justify-center">
      <Link
        href="/"
        className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <span className="font-heading italic text-white text-sm">i</span>
        <span className="text-sm font-body text-white/50">Made with Ingegno</span>
      </Link>
    </footer>
  )
}
