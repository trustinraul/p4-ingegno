import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GitHubConnect from '@/components/dashboard/GitHubConnect'
import DeleteAccountSection from '@/components/dashboard/DeleteAccountSection'
import { signOut } from '@/app/actions/auth'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Select only safe fields — NOT access_token
  const { data: connection } = await supabase
    .from('github_connections')
    .select('github_username, repos_to_show, last_synced_at')
    .eq('user_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, username')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl space-y-12">
      <h1 className="font-heading italic text-white text-3xl">Settings</h1>

      {/* Profile section */}
      <section>
        <h2 className="font-heading italic text-white text-base mb-6">Profile</h2>
        <div className="liquid-glass rounded-[1.25rem] p-7 flex items-center justify-between">
          <div>
            <p className="text-sm font-body text-white/75">Name, tagline, roles, narrative, avatar</p>
          </div>
          <Link
            href="/dashboard/profile"
            className="liquid-glass rounded-full px-5 py-2 text-sm font-body text-white/70 hover:text-white transition-colors"
          >
            Edit profile →
          </Link>
        </div>
      </section>

      {/* GitHub section */}
      <section>
        <h2 className="font-heading italic text-white text-base mb-6">GitHub</h2>
        <GitHubConnect connection={connection} />
      </section>

      {/* Account section */}
      <section>
        <h2 className="font-heading italic text-white text-base mb-6">Account</h2>
        <div className="liquid-glass rounded-[1.25rem] p-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-white/75">Email</span>
            <span className="text-sm font-body text-white/55">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-white/75">Plan</span>
            <span className="text-xs font-body px-3 py-1 rounded-full liquid-glass text-white/75">
              {profile?.plan === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>
          <div className="border-t border-white/[0.08] pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-white/75">Export your data</span>
              <a
                href="/api/export"
                className="liquid-glass rounded-full px-4 py-1.5 text-xs font-body text-white/70 hover:text-white transition-colors"
              >
                Download JSON
              </a>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-body text-white/55 hover:text-white/85 transition-colors"
              >
                Sign out
              </button>
            </form>
            {profile?.username && (
              <div className="border-t border-white/[0.08] pt-4">
                <DeleteAccountSection username={profile.username} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
