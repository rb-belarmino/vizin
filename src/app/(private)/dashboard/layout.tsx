import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/infrastructure/auth/auth'
import Image from 'next/image'

export const metadata = {
  title: 'Meus Serviços | Vizin',
  description: 'Gerencie seus anúncios de serviços no condomínio.'
}

import { UserMenu } from '@/components/layout/UserMenu'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              id="back-to-catalog-nav"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm group"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="group-hover:-translate-x-0.5 transition-transform"
              >
                <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
              </svg>
              Catálogo
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="Vizin Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <h1 className="text-sm font-semibold">Meus Serviços</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu 
              userName={session.user.name ?? ''} 
              userEmail={session.user.email}
              signOutAction={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }} 
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
    </div>
  )
}
