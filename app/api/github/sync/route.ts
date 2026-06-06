import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const syncCooldown = new Map<string, number>()
const COOLDOWN_MS = 5 * 60 * 1000

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const last = syncCooldown.get(user.id) ?? 0
  if (Date.now() - last < COOLDOWN_MS) {
    return NextResponse.json({ error: 'Rate limit: wait 5 minutes between syncs' }, { status: 429 })
  }
  syncCooldown.set(user.id, Date.now())

  // Query includes access_token — this entire handler is server-side only
  const { data: connection } = await supabase
    .from('github_connections')
    .select('access_token, github_username, repos_to_show')
    .eq('user_id', user.id)
    .single()

  if (!connection) {
    return NextResponse.json({ error: 'No GitHub connection' }, { status: 400 })
  }

  const repos: string[] = connection.repos_to_show || []
  if (repos.length === 0) return NextResponse.json({ synced: 0 })

  let totalSynced = 0

  for (const repo of repos) {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${connection.github_username}/${repo}/commits?per_page=20`,
      { headers: { Authorization: `Bearer ${connection.access_token}` } }
    )
    if (!commitsRes.ok) continue

    const commits: Array<{
      sha: string
      commit: { message: string; author: { date: string } }
    }> = await commitsRes.json()

    for (const commit of commits) {
      const { error } = await supabase.from('github_activity').upsert(
        {
          user_id: user.id,
          repo_name: repo,
          commit_message: commit.commit.message.split('\n')[0],
          commit_sha: commit.sha,
          committed_at: commit.commit.author.date,
        },
        { onConflict: 'commit_sha', ignoreDuplicates: true }
      )
      if (!error) totalSynced++
    }
  }

  await supabase
    .from('github_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return NextResponse.json({ synced: totalSynced })
}

// silence unused-param warning — Next.js requires the signature
export const dynamic = 'force-dynamic'
