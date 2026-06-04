import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileHero from '@/components/profile/ProfileHero'
import ProfileNarrative from '@/components/profile/ProfileNarrative'
import ProjectGrid from '@/components/profile/ProjectGrid'
import ActivityFeed from '@/components/profile/ActivityFeed'
import AddUpdateButton from '@/components/dashboard/AddUpdateButton'
import type { ActivityItem } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.full_name) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="liquid-glass rounded-[1.25rem] p-10 text-center max-w-sm">
          <h2 className="font-heading italic text-white text-2xl mb-3">Your profile is empty.</h2>
          <p className="font-body text-white/40 text-sm mb-6">
            Add your name, tagline, and roles to get started.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-block bg-white text-black font-body text-sm font-medium rounded-full px-6 py-2.5 hover:bg-white/90 transition-colors"
          >
            Edit profile →
          </Link>
        </div>
      </div>
    )
  }

  const [{ data: projects }, { data: githubActivity }, { data: updates }] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', user.id).order('display_order'),
    supabase.from('github_activity').select('*').eq('user_id', user.id).order('committed_at', { ascending: false }).limit(20),
    supabase.from('updates').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
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
    <div className="-m-8">
      <div className="sticky top-4 z-30 flex justify-end px-8 pointer-events-none">
        <div className="pointer-events-auto">
          <AddUpdateButton projects={projects ?? []} />
        </div>
      </div>
      <ProfileHero profile={profile} />
      <ProfileNarrative narrative={profile.narrative} />
      <ProjectGrid projects={projects ?? []} plan={profile.plan} />
      <ActivityFeed
        activity={activity}
        profile={{ avatar_url: profile.avatar_url, full_name: profile.full_name }}
      />
    </div>
  )
}
