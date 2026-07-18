import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vizin-green.vercel.app'),
  title: 'Vizin — Serviços do Condomínio',
  description:
    'Encontre e ofereça serviços entre moradores do seu condomínio. Gastronomia, reformas, aulas, beleza e muito mais.',
  keywords: ['condomínio', 'serviços', 'moradores', 'marketplace', 'vizinhos'],
  openGraph: {
    title: 'Vizin — Serviços do Condomínio',
    description: 'Encontre e ofereça serviços entre moradores do seu condomínio.',
    url: 'https://vizin-green.vercel.app',
    siteName: 'Vizin',
    locale: 'pt_BR',
    type: 'website'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
