'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

const initialState: { error?: string; success?: boolean } = {}

export default function SignupPage() {
  const [state, formAction] = useActionState(signUp, initialState)

  if (state?.success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="font-heading italic text-white text-3xl">Ingegno</span>
          </div>
          <div className="liquid-glass-strong rounded-2xl p-8 text-center">
            <h1 className="font-heading italic text-white text-2xl mb-3">
              Check your email.
            </h1>
            <p className="font-body text-white/55 text-sm leading-relaxed">
              We sent a confirmation link to your inbox.
              <br />
              Click it to activate your profile.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <span className="font-heading italic text-white text-3xl">Ingegno</span>
        </div>

        <div className="liquid-glass-strong rounded-2xl p-8">
          <h1 className="font-heading italic text-white text-2xl mb-2">
            Create your profile.
          </h1>
          <p className="font-body text-white/55 text-sm mb-8">
            Your place on the internet.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm text-white/70 uppercase tracking-wider">
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="your-handle"
                autoComplete="username"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm text-white/70 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm text-white/70 uppercase tracking-wider">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
              />
            </div>

            {state?.error && (
              <p className="font-body text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-2 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors"
            >
              Create profile
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-white/45 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-white/75 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
