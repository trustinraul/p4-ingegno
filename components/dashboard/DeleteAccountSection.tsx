'use client'

import { useActionState, useState } from 'react'
import { deleteAccount, type DeleteAccountState } from '@/app/actions/account'

const initialState: DeleteAccountState = {}

export default function DeleteAccountSection({ username }: { username: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useActionState(deleteAccount, initialState)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-body text-red-400/70 hover:text-red-400 transition-colors"
      >
        Delete account
      </button>
    )
  }

  return (
    <form action={formAction} className="space-y-3">
      <p className="text-sm font-body text-white/75">
        This permanently deletes your account, profile and all projects. This cannot be undone.
        Type <span className="text-white font-medium">{username}</span> to confirm.
      </p>
      <input
        name="confirmation"
        type="text"
        autoComplete="off"
        placeholder={username}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus:border-white/30 transition-colors"
      />
      {state.error && <p className="text-xs font-body text-red-400/80">{state.error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-red-500/80 hover:bg-red-500 text-white font-body text-sm rounded-full px-5 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          Permanently delete
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm font-body text-white/55 hover:text-white/85 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
