'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface ShareProfileProps {
  username: string
}

export default function ShareProfile({ username }: ShareProfileProps) {
  const [origin, setOrigin] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const url = `${base.replace(/\/$/, '')}/${username}`
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derives from window.location (client-only)
    setOrigin(url)
    QRCode.toDataURL(url, { margin: 1, width: 480, color: { dark: '#000000', light: '#ffffff' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [username])

  async function copyLink() {
    await navigator.clipboard.writeText(origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function downloadQr() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `ingegno-${username}-qr.png`
    a.click()
  }

  return (
    <div className="liquid-glass rounded-[1.25rem] p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
      {qrDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrDataUrl} alt="Profile QR code" className="w-20 h-20 rounded-lg bg-white p-1 shrink-0" />
      )}
      <div className="flex flex-col gap-2 min-w-0">
        <span className="font-body text-sm text-white/85 truncate">{origin}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-full px-4 py-1.5 text-xs font-body text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={downloadQr}
            disabled={!qrDataUrl}
            className="bg-white/10 hover:bg-white/15 border border-white/[0.12] rounded-full px-4 py-1.5 text-xs font-body text-white transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            Download QR
          </button>
        </div>
      </div>
    </div>
  )
}
