import { ImageResponse } from 'next/og'

export const alt = 'Ingegno — One URL. Everything you are.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#080808',
          color: '#f3ede1',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#fbbf24',
          }}
        >
          Profiles for modern polymaths
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 140, lineHeight: 1, letterSpacing: -2 }}>
            Ingegno
          </div>
          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: '#fbbf24',
              margin: '36px 0',
            }}
          />
          <div style={{ fontSize: 44, color: '#c9c0ad', maxWidth: 860 }}>
            Your life&apos;s work. One URL. For the people who can&apos;t be put
            in a box.
          </div>
        </div>
        <div style={{ fontSize: 24, letterSpacing: 4, color: '#8a8478' }}>
          p4-ingegno.vercel.app
        </div>
      </div>
    ),
    { ...size },
  )
}
