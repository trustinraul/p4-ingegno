import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Ingegno',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black flex items-start justify-center px-8 py-20">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-xs font-body text-white/40 hover:text-white/70 transition-colors mb-12 inline-block"
        >
          ← Back to Ingegno
        </Link>

        <h1 className="font-heading italic text-white text-4xl mb-4">Privacy Policy</h1>
        <p className="font-body text-sm text-white/45 mb-12">Last updated: June 2026</p>

        <div className="space-y-6 font-body text-sm text-white/65 leading-relaxed">
          <p>
            We&apos;re still drafting our full privacy policy. Check back soon.
          </p>
          <p>
            What we store today: your email address, username, and the project content you choose to publish publicly. We do not sell your data.
          </p>
          <p>
            GitHub connection: if you connect GitHub, we store only your GitHub username and the list of repositories you choose to display. Your OAuth token is never exposed to the client.
          </p>
          <p>
            Questions? Reach us at{' '}
            <a href="mailto:rcalvosanz@gmail.com" className="text-white/75 hover:text-white transition-colors">
              rcalvosanz@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
