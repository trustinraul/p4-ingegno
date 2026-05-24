import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileNavbar from '@/components/profile/ProfileNavbar'
import ProfileHero from '@/components/profile/ProfileHero'
import ProfileNarrative from '@/components/profile/ProfileNarrative'
import ProjectGrid from '@/components/profile/ProjectGrid'
import ActivityFeed from '@/components/profile/ActivityFeed'
import ProfileFooter from '@/components/profile/ProfileFooter'
import type { ActivityItem } from '@/lib/types'

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tagline, is_public')
    .eq('username', username)
    .single()

  if (!profile?.is_public) return { title: 'Ingegno' }

  return {
    title: `${profile.full_name} — Ingegno`,
    description: profile.tagline ?? undefined,
    openGraph: {
      images: [`/api/og/${username}`],
    },
  }
}

export default async function PublicProfilePage(
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', profile.id)
    .order('display_order')

  const [{ data: githubActivity }, { data: updates }] = await Promise.all([
    supabase
      .from('github_activity')
      .select('*')
      .eq('user_id', profile.id)
      .order('committed_at', { ascending: false })
      .limit(20),
    supabase
      .from('updates')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const activity: ActivityItem[] = [
    ...(githubActivity ?? []).map((a) => ({
      id: a.id,
      type: 'github_commit' as const,
      content: a.commit_message,
      repo_name: a.repo_name,
      created_at: a.committed_at,
    })),
    ...(updates ?? []).map((u) => ({
      id: u.id,
      type: 'manual_update' as const,
      content: u.content,
      image_url: u.image_url ?? undefined,
      created_at: u.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)

  return (
    <main className="bg-black min-h-screen">
      <ProfileNavbar />
      <ProfileHero profile={profile} />
      <ProfileNarrative narrative={profile.narrative} />
      <ProjectGrid projects={projects ?? []} plan={profile.plan} />
      <ActivityFeed
        activity={activity}
        profile={{ avatar_url: profile.avatar_url, full_name: profile.full_name }}
      />
      <ProfileFooter plan={profile.plan} />
    </main>
  )
}
