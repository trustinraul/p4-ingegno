'use client'
import { useState, useTransition } from 'react'
import { disconnectGitHub } from '@/app/actions/github'
import RepoSelector from './RepoSelector'

interface GitHubConnection {
  github_username: string
  repos_to_show: string[]
  last_synced_at: string | null
}

interface GitHubConnectProps {
  connection: GitHubConnection | null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export default function GitHubConnect({ connection }: GitHubConnectProps) {
  const [isPendingDisconnect, startDisconnect] = useTransition()
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)

  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  const callbackUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/github/callback`
      : ''

  function connectGitHub() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,repo&redirect_uri=${encodeURIComponent(callbackUrl)}`
  }

  async function syncNow() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch('/api/github/sync', { method: 'POST' })
      const data = await res.json()
      setSyncResult(
        data.error ? `Error: ${data.error}` : `Synced ${data.synced} commits`
      )
    } catch {
      setSyncResult('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  if (!connection) {
    return (
      <div className="liquid-glass rounded-[1.25rem] p-7 space-y-4">
        <p className="text-sm font-body text-white/75">
          Connect your GitHub account to display recent commits on your public profile.
        </p>
        <button
          onClick={connectGitHub}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] bg-white/10 hover:bg-white/15 border border-white/[0.12] text-sm font-body text-white transition-colors"
        >
          Connect GitHub
        </button>
      </div>
    )
  }

  return (
    <div className="liquid-glass rounded-[1.25rem] p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-body text-white/80">
            @{connection.github_username}
          </p>
          {connection.last_synced_at ? (
            <p className="text-xs font-body text-white/45">
              Last synced {timeAgo(connection.last_synced_at)}
            </p>
          ) : (
            <p className="text-xs font-body text-white/45">Never synced</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={syncNow}
            disabled={syncing}
            title="Pull your latest commits from the selected repositories into your public activity feed"
            className="px-4 py-2 text-sm font-body text-white/85 hover:text-white border border-white/[0.1] hover:border-white/20 rounded-[0.75rem] transition-colors disabled:opacity-50"
          >
            {syncing ? 'Syncing…' : 'Sync now'}
          </button>
          <button
            onClick={() => {
              if (!confirm('Disconnect GitHub? This will also delete your synced activity.')) return
              startDisconnect(async () => { await disconnectGitHub() })
            }}
            disabled={isPendingDisconnect}
            className="px-4 py-2 text-sm font-body text-white/45 hover:text-white/75 transition-colors disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      </div>

      <p className="text-xs font-body text-white/45 leading-relaxed">
        Syncing pulls your most recent commits from the repositories you select below into your profile&apos;s activity feed. Run it whenever you want your profile to reflect new work.
      </p>

      {syncResult && (
        <p className="text-xs font-body text-white/55">{syncResult}</p>
      )}

      <div className="border-t border-white/[0.08] pt-6">
        <RepoSelector selectedRepos={connection.repos_to_show ?? []} />
      </div>
    </div>
  )
}
