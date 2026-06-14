import type { Metadata } from 'next'
import { EB_Garamond, Barlow } from 'next/font/google'
import MotionProvider from '@/components/MotionProvider'
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
  metadataBase: new URL('https://p4-ingegno.vercel.app'),
  title: 'Ingegno',
  description: 'Premium public profiles for modern polymaths.',
  openGraph: {
    title: 'Ingegno — One URL. Everything you are.',
    description:
      "Your life's work. One URL. Premium public profiles for the people who can't be put in a box.",
    type: 'website',
    url: 'https://p4-ingegno.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${barlow.variable}`}>
      <body className="font-body antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
