'use client'

import { useTransition, useState } from 'react'
import { createProject, updateProject } from '@/app/actions/projects'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  url: string | null
}

interface ProjectFormProps {
  project?: Project
  onClose?: () => void
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        onClose?.()
      }
    })
  }

  const inputClass =
    'w-full bg-white/[0.06] border border-white/[0.1] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <form action={handleSubmit} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Name *
        </label>
        <input
          name="name"
          required
          defaultValue={project?.name}
          placeholder="Project name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={project?.description ?? ''}
          placeholder="What is this project about?"
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          Status
        </label>
        <select
          name="status"
          defaultValue={project?.status ?? 'in_progress'}
          className={inputClass}
        >
          <option value="in_progress">In Progress</option>
          <option value="launched">Launched</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-body text-white/40 tracking-widest uppercase mb-2">
          URL
        </label>
        <input
          name="url"
          type="url"
          defaultValue={project?.url ?? ''}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm font-body text-red-400">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : project ? 'Save changes' : 'Add project'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-body text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
