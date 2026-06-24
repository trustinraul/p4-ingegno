import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendWelcomeEmailOnce } from '@/lib/email'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const username = data.user.user_metadata?.username
      if (username) {
        await supabase
          .from('profiles')
          .upsert({ id: data.user.id, username }, { onConflict: 'id', ignoreDuplicates: true })
        await sendWelcomeEmailOnce(data.user.id, data.user.email!, username)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
