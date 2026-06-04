import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, is_public')
    .eq('id', user.id)
    .single()

  return (
    <DashboardShell
      username={profile?.username ?? ''}
      isPublic={profile?.is_public ?? false}
    >
      {children}
    </DashboardShell>
  )
}
