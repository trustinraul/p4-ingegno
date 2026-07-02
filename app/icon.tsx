import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
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
          background: '#000000',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Instrument Serif',
            fontSize: 26,
            color: '#FFFFFF',
            lineHeight: 1,
          }}
        >
          i
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Instrument Serif', data: font, style: 'normal' as const }],
    }
  )
}
