import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const font = await readFile(join(process.cwd(), 'app/fonts/InstrumentSerif-Regular.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // El cuadrado exterior lo enmascara iOS; el círculo con borde va dentro
          background: '#000000',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 150,
            height: 150,
            borderRadius: '50%',
            border: '8px solid rgba(255,255,255,0.18)',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Instrument Serif',
              fontSize: 74,
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            i
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: font, style: 'normal' as const }],
    }
  )
}
