import { ImageResponse } from '@vercel/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  // Edge runtime can't use cookies() — use anon client for this public read
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, tagline, roles, is_public')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) {
    return new Response('Not found', { status: 404 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontStyle: 'italic',
            color: '#fff',
            fontWeight: 400,
            letterSpacing: '-3px',
            lineHeight: 0.9,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          {profile.full_name}
        </div>

        {/* Tagline */}
        {profile.tagline && (
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'sans-serif',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: 32,
              maxWidth: '700px',
            }}
          >
            {profile.tagline}
          </div>
        )}

        {/* Role pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(profile.roles ?? []).slice(0, 4).map((role: string) => (
            <div
              key={role}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 16,
                fontFamily: 'sans-serif',
              }}
            >
              {role}
            </div>
          ))}
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 18,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'serif',
          }}
        >
          ingegno.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
