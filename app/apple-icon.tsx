import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
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
          // Sin borderRadius: iOS aplica su propia máscara
          background: '#1F1F1F',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'EB Garamond',
            fontStyle: 'italic',
            fontSize: 125,
            color: '#FFFFFF',
            lineHeight: 1,
            marginTop: -14,
            marginLeft: 10,
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
