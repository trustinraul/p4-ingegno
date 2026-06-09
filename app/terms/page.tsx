import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Ingegno',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black flex items-start justify-center px-8 py-20">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-xs font-body text-white/40 hover:text-white/70 transition-colors mb-12 inline-block"
        >
          ← Back to Ingegno
        </Link>

        <h1 className="font-heading italic text-white text-4xl mb-4">Terms of Service</h1>
        <p className="font-body text-sm text-white/45 mb-12">Last updated: June 2026</p>

        <div className="space-y-6 font-body text-sm text-white/65 leading-relaxed">
          <p>
            We&apos;re still drafting our full terms. Check back soon.
          </p>
          <p>
            In the meantime, by using Ingegno you agree to use it in good faith — no spam, no impersonation, no abuse of the platform.
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
