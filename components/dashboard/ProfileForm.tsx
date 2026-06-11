'use client'

import { useActionState, useTransition, useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { updateProfile, updatePublicStatus, uploadAvatar } from '@/app/actions/profile'
import type { ProfileState } from '@/app/actions/profile'
import { cn } from '@/lib/utils'

interface Profile {
  id: string
  username: string
  full_name: string | null
  tagline: string | null
  roles: string[] | null
  narrative: string | null
  avatar_url: string | null
  is_public: boolean
  plan: string
}

interface ProfileFormProps {
  profile: Profile | null
}

const initialState: ProfileState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-white text-black font-body text-sm font-medium rounded-full px-6 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState)
  const [isPending, startTransition] = useTransition()

  const [roles, setRoles] = useState<string[]>(profile?.roles ?? [])
  const [roleInput, setRoleInput] = useState('')
  const [narrative, setNarrative] = useState(profile?.narrative ?? '')
  const wordCount = narrative.trim().split(/\s+/).filter(Boolean).length
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? false)
  const [toggleError, setToggleError] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '')
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarPending, setAvatarPending] = useState(false)

  const MAX_ROLES = 10

  function commitRole() {
    const trimmed = roleInput.trim()
    if (trimmed && !roles.includes(trimmed) && roles.length < MAX_ROLES) {
      setRoles([...roles, trimmed])
    }
    setRoleInput('')
  }

  function handleRoleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitRole()
    }
  }

  function removeRole(role: string) {
    setRoles(roles.filter((r) => r !== role))
  }

  function handleToggle() {
    const next = !isPublic
    setIsPublic(next)
    setToggleError(null)
    startTransition(async () => {
      const result = await updatePublicStatus(next)
      if (result?.error) {
        setIsPublic(!next)
        setToggleError(result.error)
      }
    })
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(null)
    setAvatarPending(true)
    const fd = new FormData()
    fd.append('avatar', file)
    const result = await uploadAvatar(fd)
    setAvatarPending(false)
    if (result?.error) {
      setAvatarError(result.error)
    } else if (result?.url) {
      setAvatarUrl(result.url)
    }
  }

  const initials = (profile?.full_name ?? profile?.username ?? '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col gap-8">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
          ) : (
            <span className="font-heading italic text-white text-xl">{initials}</span>
          )}
          {avatarPending && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-body">…</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="font-body text-sm text-white/75 hover:text-white transition-colors"
          >
            Upload photo
          </button>
          <p className="font-body text-xs text-white/45">JPG, PNG or WebP. Max 2 MB.</p>
          {avatarError && (
            <p className="font-body text-xs text-red-400/80">{avatarError}</p>
          )}
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Main form */}
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="roles" value={roles.join(',')} />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-sm text-white/70 uppercase tracking-wider">
              Full name
            </label>
            <input
              name="full_name"
              type="text"
              defaultValue={profile?.full_name ?? ''}
              placeholder="Ada Lovelace"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-sm text-white/70 uppercase tracking-wider">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={profile?.username ?? ''}
              readOnly
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-white/30 font-body text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm text-white/70 uppercase tracking-wider">
            Tagline
          </label>
          <input
            name="tagline"
            type="text"
            defaultValue={profile?.tagline ?? ''}
            placeholder="Founder · Designer · Writer"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors"
          />
        </div>

        {/* Roles tag input */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm text-white/70 uppercase tracking-wider">
            Roles
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {roles.map((role) => (
              <span
                key={role}
                className="liquid-glass rounded-full px-3 py-1 text-sm font-body text-white/70 flex items-center gap-1.5"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="text-white/45 hover:text-white/85 transition-colors leading-none"
                  aria-label={`Remove ${role}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={handleRoleKeyDown}
              enterKeyHint="done"
              disabled={roles.length >= MAX_ROLES}
              placeholder={roles.length >= MAX_ROLES ? 'Maximum 10 roles' : 'Add a role'}
              className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors disabled:opacity-40"
            />
            <button
              type="button"
              onClick={commitRole}
              disabled={!roleInput.trim() || roles.length >= MAX_ROLES}
              className="shrink-0 bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-xl px-4 py-3 text-sm font-body text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              aria-label="Add role"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-body text-sm text-white/70 uppercase tracking-wider">
              Narrative
            </label>
            <span
              className={cn(
                'font-body text-xs transition-colors',
                wordCount > 250 ? 'text-red-400/80' : 'text-white/45'
              )}
            >
              {wordCount}/250 words
            </span>
          </div>
          <textarea
            name="narrative"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Tell the world who you are and what you're building…"
            rows={7}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors resize-none"
          />
        </div>

        {state?.error && (
          <p className="font-body text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-xl px-4 py-3">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="font-body text-sm text-white/50 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            Profile saved.
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <SubmitButton />

          {/* Make public toggle */}
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-white/55">Make public</span>
            <button
              type="button"
              onClick={handleToggle}
              disabled={isPending}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:opacity-50',
                isPublic ? 'bg-white/30' : 'bg-white/10'
              )}
              aria-pressed={isPublic}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  isPublic ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
        {toggleError && (
          <p className="font-body text-xs text-red-400/80 text-right">{toggleError}</p>
        )}
      </form>
    </div>
  )
}
