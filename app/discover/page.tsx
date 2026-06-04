import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/landing/Navbar'
import DiscoverCard from '@/components/landing/DiscoverCard'

export const revalidate = 60

export default async function DiscoverPage() {
  const supabase = await createClient()

  const threeDaysHalfAgo = new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: profiles }, { data: recentUpdates }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, roles')
      .eq('is_public', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('updates')
      .select('user_id')
      .gt('created_at', threeDaysHalfAgo),
  ])

  const updateCounts = new Map<string, number>()
  for (const u of recentUpdates ?? []) {
    updateCounts.set(u.user_id, (updateCounts.get(u.user_id) ?? 0) + 1)
  }

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-12">
          <h1 className="font-heading italic text-white text-5xl md:text-6xl mb-3">Discover.</h1>
          <p className="font-body text-white/40 text-lg">
            Modern polymaths building in public.
          </p>
        </div>

        {(!profiles || profiles.length === 0) ? (
          <div className="liquid-glass rounded-[1.25rem] p-12 text-center">
            <p className="font-body text-white/40">No public profiles yet. Be the first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <DiscoverCard
                key={profile.id}
                profile={profile}
                recentUpdates={updateCounts.get(profile.id) ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
