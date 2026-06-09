import type { Metadata } from 'next'
import { EB_Garamond, Barlow } from 'next/font/google'
import './globals.css'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: 'Ingegno',
  description: 'Premium public profiles for modern polymaths.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${barlow.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
