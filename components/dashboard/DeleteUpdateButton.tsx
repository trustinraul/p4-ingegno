'use client'

import { deleteUpdate } from '@/app/actions/updates'

export default function DeleteUpdateButton({ id }: { id: string }) {
  return (
    <form
      action={deleteUpdate.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm('Delete this update?')) e.preventDefault()
      }}
    >
      <button
        type="submit"
        className="p-2 text-white/45 hover:text-red-400/70 transition-colors text-sm font-body shrink-0"
      >
        Delete
      </button>
    </form>
  )
}
