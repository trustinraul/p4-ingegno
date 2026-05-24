'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(prevState: { error?: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = (formData.get('username') as string).toLowerCase().trim()

  if (!/^[a-z0-9-]{3,20}$/.test(username)) {
    return { error: 'Username: 3–20 characters, letters, numbers, hyphens only' }
  }
  const reserved = ['admin', 'api', 'dashboard', 'login', 'signup', 'settings']
  if (reserved.includes(username)) {
    return { error: 'That username is reserved' }
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()
  if (existing) return { error: 'Username already taken' }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }
  if (!data.user) return { error: 'Signup failed — please try again' }

  await supabase.from('profiles').insert({ id: data.user.id, username })

  redirect('/dashboard/profile')
}

export async function signIn(prevState: { error?: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
