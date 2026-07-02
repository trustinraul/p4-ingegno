import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const font = await readFile(join(process.cwd(), 'app/fonts/InstrumentSerif-Italic.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Sin borderRadius: iOS aplica su propia máscara
          background: '#0A0A0A',
        }}
      >
        <div
          style={{
            fontFamily: 'Instrument Serif',
            fontStyle: 'italic',
            fontSize: 132,
            color: '#8B5CF6',
            lineHeight: 1,
            marginTop: -10,
          }}
        >
          I
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: font, style: 'italic' as const }],
    }
  )
}
