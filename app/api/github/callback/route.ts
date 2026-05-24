import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=no_code', request.url))
  }

  // Exchange code for access token — GITHUB_CLIENT_SECRET stays server-side only
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json()
  const accessToken: string = tokenData.access_token

  if (!accessToken) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=token_exchange_failed', request.url)
    )
  }

  // Get GitHub username — access_token used only server-side
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const githubUser = await userRes.json()

  // Store in DB — upsert (one connection per user)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  await supabase.from('github_connections').upsert({
    user_id: user.id,
    github_username: githubUser.login,
    access_token: accessToken,
  })

  return NextResponse.redirect(new URL('/dashboard/settings?connected=true', request.url))
}
