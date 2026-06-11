'use client'

import { useTransition, useState, useRef } from 'react'
import { createProject, updateProject, uploadProjectImage } from '@/app/actions/projects'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  url: string | null
  cover_image_url: string | null
}

interface ProjectFormProps {
  project?: Project
  onClose?: () => void
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [coverUrl, setCoverUrl] = useState(project?.cover_image_url ?? '')
  const [coverPending, setCoverPending] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setCoverPending(true)
    const fd = new FormData()
    fd.append('image', file)
    const result = await uploadProjectImage(fd)
    setCoverPending(false)
    if (result?.error) setError(result.error)
    else if (result?.url) setCoverUrl(result.url)
  }

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
    'w-full bg-white/[0.06] border border-white/[0.1] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black focus:border-white/30 transition-colors'

  return (
    <form action={handleSubmit} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      <div>
        <label className="block text-sm font-body text-white/70 tracking-widest uppercase mb-2">
          Cover image
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-[0.6rem] overflow-hidden bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/30 text-xs font-body">No image</span>
            )}
            {coverPending && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xs font-body">…</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="font-body text-sm text-white/75 hover:text-white transition-colors text-left"
            >
              {coverUrl ? 'Replace image' : 'Upload image'}
            </button>
            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl('')}
                className="font-body text-xs text-white/40 hover:text-white/70 transition-colors text-left"
              >
                Remove
              </button>
            )}
            <p className="font-body text-xs text-white/40">JPG, PNG, WebP or GIF. Max 5 MB.</p>
          </div>
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      <div>
        <label className="block text-sm font-body text-white/70 tracking-widest uppercase mb-2">
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
        <label className="block text-sm font-body text-white/70 tracking-widest uppercase mb-2">
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
        <label className="block text-sm font-body text-white/70 tracking-widest uppercase mb-2">
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
        <label className="block text-sm font-body text-white/70 tracking-widest uppercase mb-2">
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
          className="flex-1 bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-[0.75rem] px-4 py-2.5 text-sm font-body text-white transition-colors disabled:opacity-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {isPending ? 'Saving…' : project ? 'Save changes' : 'Add project'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-body text-white/55 hover:text-white/70 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
