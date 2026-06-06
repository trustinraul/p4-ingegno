'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('projects')
    .select('display_order')
    .eq('user_id', user.id)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = existing?.[0]?.display_order != null ? existing[0].display_order + 1 : 0

  const name = (formData.get('name') as string).trim()
  if (!name) return { error: 'Project name is required' }
  if (name.length > 100) return { error: 'Project name must be under 100 characters' }

  const urlRaw = (formData.get('url') as string) || null
  if (urlRaw) {
    try { new URL(urlRaw) } catch { return { error: 'Project URL must be a valid URL' } }
  }

  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    name,
    description: (formData.get('description') as string) || null,
    status: (formData.get('status') as string) || 'in_progress',
    url: urlRaw,
    display_order: nextOrder,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = (formData.get('name') as string).trim()
  if (!name) return { error: 'Project name is required' }
  if (name.length > 100) return { error: 'Project name must be under 100 characters' }

  const urlRaw = (formData.get('url') as string) || null
  if (urlRaw) {
    try { new URL(urlRaw) } catch { return { error: 'Project URL must be a valid URL' } }
  }

  const { error } = await supabase
    .from('projects')
    .update({
      name,
      description: (formData.get('description') as string) || null,
      status: formData.get('status') as string,
      url: urlRaw,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/dashboard/projects')
}

export async function moveProjectUp(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: projects } = await supabase
    .from('projects')
    .select('id, display_order')
    .eq('user_id', user.id)
    .order('display_order')

  if (!projects) return
  const idx = projects.findIndex((p) => p.id === id)
  if (idx <= 0) return

  const current = projects[idx]
  const above = projects[idx - 1]

  await supabase.from('projects').update({ display_order: above.display_order }).eq('id', current.id)
  await supabase.from('projects').update({ display_order: current.display_order }).eq('id', above.id)
  revalidatePath('/dashboard/projects')
}

export async function moveProjectDown(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: projects } = await supabase
    .from('projects')
    .select('id, display_order')
    .eq('user_id', user.id)
    .order('display_order')

  if (!projects) return
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1 || idx >= projects.length - 1) return

  const current = projects[idx]
  const below = projects[idx + 1]

  await supabase.from('projects').update({ display_order: below.display_order }).eq('id', current.id)
  await supabase.from('projects').update({ display_order: current.display_order }).eq('id', below.id)
  revalidatePath('/dashboard/projects')
}
