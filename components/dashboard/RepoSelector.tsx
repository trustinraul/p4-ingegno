'use client'
import { useEffect, useState, useTransition } from 'react'
import { getUserRepos, updateReposToShow } from '@/app/actions/github'

interface RepoSelectorProps {
  selectedRepos: string[]
}

export default function RepoSelector({ selectedRepos }: RepoSelectorProps) {
  const [allRepos, setAllRepos] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedRepos))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserRepos().then((repos) => {
      setAllRepos(repos)
      setLoading(false)
    })
  }, [])

  function toggle(repo: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(repo)) {
        next.delete(repo)
      } else {
        next.add(repo)
      }
      return next
    })
  }

  function save() {
    setStatus(null)
    startTransition(async () => {
      const result = await updateReposToShow(Array.from(selected))
      setStatus(result?.error ? result.error : 'Saved')
      setTimeout(() => setStatus(null), 2000)
    })
  }

  if (loading) {
    return <p className="text-sm font-body text-white/45">Loading repos…</p>
  }

  if (allRepos.length === 0) {
    return <p className="text-sm font-body text-white/45">No repositories found.</p>
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-body text-white/55 tracking-widest uppercase">
        Repos to show on your profile
      </p>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {allRepos.map((repo) => (
          <label key={repo} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.has(repo)}
              onChange={() => toggle(repo)}
              className="accent-white/60 w-4 h-4"
            />
            <span className="text-sm font-body text-white/75 group-hover:text-white/80 transition-colors">
              {repo}
            </span>
          </label>
        ))}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={save}
          disabled={isPending}
          className="text-sm font-body px-4 py-2 rounded-[0.75rem] bg-white/10 hover:bg-white/15 border border-white/[0.12] text-white transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save selection'}
        </button>
        {status && (
          <span className="text-xs font-body text-white/55">{status}</span>
        )}
      </div>
    </div>
  )
}
