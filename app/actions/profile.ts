'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { validateImageUpload } from '@/lib/utils'

export type ProfileState = { error?: string; success?: boolean }

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const full_name = (formData.get('full_name') as string) || null
  const tagline = (formData.get('tagline') as string) || null
  const narrative = (formData.get('narrative') as string) || null
  const rolesRaw = formData.get('roles') as string
  const roles = rolesRaw
    ? rolesRaw.split(',').map((r) => r.trim()).filter(Boolean)
    : []

  if (full_name && full_name.length > 100) return { error: 'Full name must be under 100 characters' }
  if (tagline && tagline.length > 140) return { error: 'Tagline must be under 140 characters' }
  if (narrative && narrative.length > 2000) return { error: 'Narrative must be under 2000 characters' }
  if (roles.length > 10) return { error: 'Maximum 10 roles allowed' }

  const updates = {
    full_name,
    tagline,
    roles,
    narrative,
  }

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function updatePublicStatus(isPublic: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_public: isPublic })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { error: 'No file provided' }

  const fileError = validateImageUpload(file)
  if (fileError) return { error: fileError }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }
  revalidatePath('/dashboard/profile')
  return { success: true, url: publicUrl }
}
