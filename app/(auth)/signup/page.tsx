'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

const initialState: { error?: string; success?: boolean } = {}

function validateUsername(value: string): string | null {
  if (!value) return null
  return /^[a-z0-9-]{3,20}$/.test(value)
    ? null
    : '3–20 characters: lowercase letters, numbers, hyphens.'
}

function validateEmail(value: string): string | null {
  if (!value) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : 'Enter a valid email address.'
}

function validatePassword(value: string): string | null {
  if (!value) return null
  return value.length >= 6 ? null : 'At least 6 characters.'
}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  const [username, setUsername] = useState('')
  const [usernameTouched, setUsernameTouched] = useState(false)

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const [password, setPassword] = useState('')
  const [passwordTouched, setPasswordTouched] = useState(false)

  const usernameError = usernameTouched ? validateUsername(username) : null
  const emailError = emailTouched ? validateEmail(email) : null
  const passwordError = passwordTouched ? validatePassword(password) : null

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
              <label className="font-body text-sm text-white/70">
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="your-handle"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setUsernameTouched(true)}
                aria-invalid={usernameError !== null ? true : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
              />
              {usernameError && (
                <p className="font-body text-xs text-red-400/80">{usernameError}</p>
              )}
            </div>

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
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                aria-invalid={passwordError !== null ? true : undefined}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
              />
              {passwordError && (
                <p className="font-body text-xs text-red-400/80">{passwordError}</p>
              )}
            </div>

            {state?.error && (
              <p className="font-body text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full mt-2 bg-white text-black font-body text-sm font-medium rounded-full py-3 hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? 'Creating profile…' : 'Create profile'}
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
