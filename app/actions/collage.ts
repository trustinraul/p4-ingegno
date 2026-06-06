'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function publishProjectCollage(projectId: string): Promise<{
  proposedImages: string[]
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { proposedImages: [], error: 'Not authenticated' }

  const { data: project } = await supabase
    .from('projects')
    .select('status')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (!project) return { proposedImages: [], error: 'Project not found' }
  if (project.status !== 'launched') return { proposedImages: [], error: 'Project must be launched first' }

  const { data: updates } = await supabase
    .from('updates')
    .select('image_url, created_at')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: true })

  const images = (updates ?? []).map((u) => u.image_url as string)

  if (images.length < 2) {
    return { proposedImages: [], error: 'Need at least 2 images linked to this project to create a collage' }
  }

  return { proposedImages: images.slice(0, 12) }
}

export async function confirmProjectCollage(projectId: string, orderedImageUrls: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (orderedImageUrls.length < 2) return { error: 'Minimum 2 images required' }
  if (orderedImageUrls.length > 12) return { error: 'Maximum 12 images allowed' }

  const { error } = await supabase
    .from('project_collages')
    .upsert({ user_id: user.id, project_id: projectId, image_urls: orderedImageUrls })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  revalidatePath('/discover')
  return { success: true }
}
