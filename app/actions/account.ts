'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export type DeleteAccountState = { error?: string }

const USER_BUCKETS = ['avatars', 'project-images', 'update-images']

async function purgeUserStorage(
  admin: ReturnType<typeof createAdminClient>,
  userId: string
) {
  for (const bucket of USER_BUCKETS) {
    try {
      const { data: files } = await admin.storage.from(bucket).list(userId)
      if (files && files.length > 0) {
        await admin.storage.from(bucket).remove(files.map((f) => `${userId}/${f.name}`))
      }
    } catch {
      // best-effort: storage cleanup failures must not block account deletion
    }
  }
}

export async function deleteAccount(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const confirmation = ((formData.get('confirmation') as string) || '').trim()
  if (!profile || confirmation !== profile.username) {
    return { error: 'The username you typed does not match.' }
  }

  const admin = createAdminClient()
  await purgeUserStorage(admin, user.id)
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) return { error: error.message }

  await supabase.auth.signOut()
  redirect('/')
}
