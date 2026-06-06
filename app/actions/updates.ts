'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { validateImageUpload } from '@/lib/utils'

export async function createUpdate(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const content = (formData.get('content') as string).trim()
  if (!content) return { error: 'Update content is required' }
  if (content.length > 2000) return { error: 'Update must be under 2000 characters' }

  const imageFile = formData.get('image') as File | null
  let image_url: string | null = null

  if (imageFile && imageFile.size > 0) {
    const fileError = validateImageUpload(imageFile)
    if (fileError) return { error: fileError }

    const ext = imageFile.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('update-images')
      .upload(path, imageFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('update-images')
        .getPublicUrl(path)
      image_url = publicUrl
    }
  }

  const { error } = await supabase.from('updates').insert({
    user_id: user.id,
    project_id: (formData.get('project_id') as string) || null,
    content,
    image_url,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/updates')
  return { success: true }
}

export async function deleteUpdate(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('updates').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/updates')
}
