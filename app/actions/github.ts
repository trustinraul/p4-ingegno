'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateReposToShow(repos: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  await supabase
    .from('github_connections')
    .update({ repos_to_show: repos })
    .eq('user_id', user.id)
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function getUserRepos(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: connection } = await supabase
    .from('github_connections')
    .select('access_token, github_username')
    .eq('user_id', user.id)
    .single()
  if (!connection) return []
  const res = await fetch(
    `https://api.github.com/users/${connection.github_username}/repos?per_page=100&sort=pushed`,
    { headers: { Authorization: `Bearer ${connection.access_token}` } }
  )
  if (!res.ok) return []
  const repos: Array<{ name: string }> = await res.json()
  return repos.map((r) => r.name)
}

export async function disconnectGitHub() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('github_connections').delete().eq('user_id', user.id)
  await supabase.from('github_activity').delete().eq('user_id', user.id)
  revalidatePath('/dashboard/settings')
}
