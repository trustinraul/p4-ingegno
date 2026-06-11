import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const [{ data: profile }, { data: projects }, { data: updates }, { data: githubActivity }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('projects').select('*').eq('user_id', user.id).order('display_order'),
      supabase.from('updates').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('github_activity').select('*').eq('user_id', user.id).order('committed_at'),
    ])

  const payload = {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email },
    profile,
    projects: projects ?? [],
    updates: updates ?? [],
    github_activity: githubActivity ?? [],
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="ingegno-export.json"',
    },
  })
}
