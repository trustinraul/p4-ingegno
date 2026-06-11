import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/dashboard/ProfileForm'
import ShareProfile from '@/components/dashboard/ShareProfile'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading italic text-white text-3xl">Edit Profile</h1>
        <span
          className={`text-xs font-body px-3 py-1 rounded-full ${
            profile?.is_public
              ? 'bg-white/10 text-white/85'
              : 'bg-white/5 text-white/45'
          }`}
        >
          {profile?.is_public ? '● Live' : '○ Draft'}
        </span>
      </div>
      {profile?.username && (
        <div className="mb-8">
          <ShareProfile username={profile.username} />
        </div>
      )}
      <ProfileForm profile={profile} />
    </div>
  )
}
