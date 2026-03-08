import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Import the wrapper component we just created
import { SessionProvider } from '@/presentation/components/providers/session-provider'
// Import the Toaster component from Shadcn (verify the exact path based on where shadcn downloaded it)
import { Toaster } from '@/presentation/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vizin',
  description: 'Portal do Morador'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        {/* Place the Toaster at the root so it can be called from any page */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
