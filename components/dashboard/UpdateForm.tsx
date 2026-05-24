'use client'
import { useTransition, useState, useRef } from 'react'
import { createUpdate } from '@/app/actions/updates'

interface Project {
  id: string
  name: string
}

interface UpdateFormProps {
  projects: Project[]
}

export default function UpdateForm({ projects }: UpdateFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createUpdate(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  const inputClass =
    'w-full bg-white/[0.06] border border-white/[0.1] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <form ref={formRef} action={handleSubmit} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Update *
        </label>
        <textarea
          name="content"
          required
          rows={3}
          placeholder="What are you building? Share a milestone, a lesson, a decision…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.length > 0 && (
          <div>
            <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
              Project (optional)
            </label>
            <select name="project_id" className={inputClass}>
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
            Image (optional)
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full text-sm font-body text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-[0.5rem] file:border-0 file:text-xs file:font-body file:bg-white/10 file:text-white/60 hover:file:bg-white/15 file:cursor-pointer cursor-pointer"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-body text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-[0.75rem] px-5 py-2.5 text-sm font-body text-white transition-colors disabled:opacity-50"
      >
        {isPending ? 'Posting…' : 'Post update'}
      </button>
    </form>
  )
}
