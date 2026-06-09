import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLockedProjects } from '@/lib/plan'
import ProjectsClient from '@/components/dashboard/ProjectsClient'
import type { Project } from '@/lib/types'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: projects }, { data: profile }, { data: collages }] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order'),
    supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single(),
    supabase
      .from('project_collages')
      .select('project_id')
      .eq('user_id', user.id),
  ])

  const plan = (profile?.plan ?? 'free') as 'free' | 'pro'
  const allProjects: Project[] = projects ?? []
  const lockedProjects = getLockedProjects(allProjects, plan)
  const lockedIds = lockedProjects.map((p) => p.id)
  const collageProjectIds = (collages ?? []).map((c) => c.project_id)
  const showBanner = plan === 'free' && allProjects.length > 2

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading italic text-white text-3xl">Projects</h1>
      </div>

      {showBanner && (
        <div className="liquid-glass rounded-[1rem] p-4 text-sm font-body text-white/75">
          You have {allProjects.length} projects. Only the first 2 are visible on your public profile.{' '}
          <span className="text-white/90 underline underline-offset-2 cursor-pointer">
            Upgrade to Pro
          </span>{' '}
          to show all.
        </div>
      )}

      <ProjectsClient
        projects={allProjects}
        lockedIds={lockedIds}
        collageProjectIds={collageProjectIds}
      />
    </div>
  )
}
