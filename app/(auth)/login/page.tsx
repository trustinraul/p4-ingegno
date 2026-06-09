'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

const initialState = { error: undefined as string | undefined }

function validateEmail(value: string): string | null {
  if (!value) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : 'Enter a valid email address.'
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const emailError = emailTouched ? validateEmail(email) : null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <span className="font-heading italic text-white text-3xl">Ingegno</span>
        </div>

        <div className="liquid-glass-strong rounded-2xl p-8">
          <h1 className="font-heading italic text-white text-2xl mb-2">
            Sign in.
          </h1>
          <p className="font-body text-white/55 text-sm mb-8">
            Welcome back.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm text-white/70">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                aria-invalid={emailError !== null ? true : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
              />
              {emailError && (
                <p className="font-body text-xs text-red-400/80">{emailError}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm text-white/70">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                required
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
              disabled={pending}
              className="w-full mt-2 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-white/45 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white/75 hover:text-white transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
