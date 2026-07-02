import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  const font = await readFile(join(process.cwd(), 'app/fonts/EBGaramond-Italic.woff'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1F1F1F',
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'EB Garamond',
            fontStyle: 'italic',
            fontSize: 22,
            color: '#FFFFFF',
            lineHeight: 1,
            marginTop: -2,
            marginLeft: 2,
          }}
        >
          i
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'EB Garamond', data: font, style: 'italic' as const }],
    }
  )
}
