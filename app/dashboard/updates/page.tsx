import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { deleteUpdate } from '@/app/actions/updates'
import UpdateForm from '@/components/dashboard/UpdateForm'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function UpdatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: updates }, { data: projects }] = await Promise.all([
    supabase
      .from('updates')
      .select('*, projects(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('projects')
      .select('id, name')
      .eq('user_id', user.id)
      .order('display_order'),
  ])

  return (
    <div className="space-y-8">
      <h1 className="font-heading italic text-white text-3xl">Updates</h1>

      <UpdateForm projects={projects ?? []} />

      {(!updates || updates.length === 0) ? (
        <p className="text-sm font-body text-white/40 text-center py-12">
          No updates yet. Post your first update to start building in public.
        </p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="liquid-glass rounded-[1.25rem] p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <p className="text-sm font-body text-white/80 leading-relaxed whitespace-pre-wrap">
                    {update.content}
                  </p>

                  {update.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={update.image_url}
                      alt="Update image"
                      className="rounded-[0.75rem] max-h-64 object-cover w-full"
                    />
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    {update.projects?.name && (
                      <span className="text-xs font-body px-2.5 py-0.5 rounded-full border border-white/10 text-white/40">
                        {update.projects.name}
                      </span>
                    )}
                    <span className="text-xs font-body text-white/30">
                      {timeAgo(update.created_at)}
                    </span>
                  </div>
                </div>

                <form action={deleteUpdate.bind(null, update.id)}>
                  <button
                    type="submit"
                    className="p-2 text-white/20 hover:text-red-400/70 transition-colors text-sm font-body shrink-0"
                    onClick={(e) => {
                      if (!confirm('Delete this update?')) e.preventDefault()
                    }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
