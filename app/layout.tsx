import type { Metadata, Viewport } from 'next'
import { Quicksand, Righteous } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'

const quicksand = Quicksand({ variable: '--font-quicksand', subsets: ['latin'] })
const righteous = Righteous({ variable: '--font-righteous', subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'ExpControl',
  description: 'Controle de finanças pessoais',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ExpControl',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#291b2a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${quicksand.variable} ${righteous.variable} h-full antialiased`}>
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
