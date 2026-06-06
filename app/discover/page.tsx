import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/landing/Navbar'
import DiscoverCard from '@/components/discover/DiscoverCard'
import ProjectCollageCard from '@/components/discover/ProjectCollageCard'

export const revalidate = 60

type DiscoverItem =
  | {
      type: 'update'
      id: string
      created_at: string
      update: { id: string; content: string; image_url: string; created_at: string }
      author: { username: string; full_name: string | null; avatar_url: string | null }
    }
  | {
      type: 'collage'
      id: string
      created_at: string
      collage: { image_urls: string[]; created_at: string }
      project: { name: string }
      author: { username: string; full_name: string | null; avatar_url: string | null }
    }

export default async function DiscoverPage() {
  const supabase = await createClient()

  const [{ data: updates }, { data: collages }] = await Promise.all([
    supabase
      .from('updates')
      .select('id, content, image_url, created_at, profiles!inner(username, full_name, avatar_url, is_public)')
      .not('image_url', 'is', null)
      .eq('profiles.is_public', true)
      .order('created_at', { ascending: false })
      .limit(60),
    supabase
      .from('project_collages')
      .select('id, image_urls, created_at, project_id, projects!inner(name, status), profiles!inner(username, full_name, avatar_url, is_public)')
      .eq('projects.status', 'launched')
      .eq('profiles.is_public', true)
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  const items: DiscoverItem[] = []

  for (const u of updates ?? []) {
    const profile = u.profiles as unknown as { username: string; full_name: string | null; avatar_url: string | null; is_public: boolean }
    if (!profile?.is_public) continue
    items.push({
      type: 'update',
      id: u.id,
      created_at: u.created_at,
      update: { id: u.id, content: u.content, image_url: u.image_url!, created_at: u.created_at },
      author: { username: profile.username, full_name: profile.full_name, avatar_url: profile.avatar_url },
    })
  }

  for (const c of collages ?? []) {
    const profile = c.profiles as unknown as { username: string; full_name: string | null; avatar_url: string | null; is_public: boolean }
    const project = c.projects as unknown as { name: string; status: string }
    if (!profile?.is_public) continue
    items.push({
      type: 'collage',
      id: c.id,
      created_at: c.created_at,
      collage: { image_urls: c.image_urls, created_at: c.created_at },
      project: { name: project.name },
      author: { username: profile.username, full_name: profile.full_name, avatar_url: profile.avatar_url },
    })
  }

  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-12">
          <h1 className="font-heading italic text-white text-5xl md:text-6xl mb-3">Discover.</h1>
          <p className="font-body text-white/40 text-lg">
            Modern polymaths building in public.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="liquid-glass rounded-[1.25rem] p-12 text-center">
            <p className="font-body text-white/40">
              No visual updates yet. Be the first to post one.
            </p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
            {items.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-3">
                {item.type === 'update' ? (
                  <DiscoverCard update={item.update} author={item.author} />
                ) : (
                  <ProjectCollageCard
                    collage={item.collage}
                    project={item.project}
                    author={item.author}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
