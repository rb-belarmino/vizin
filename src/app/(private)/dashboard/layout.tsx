import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/infrastructure/auth/auth'
import Image from 'next/image'

export const metadata = {
  title: 'Meus Serviços | Vizin',
  description: 'Gerencie seus anúncios de serviços no condomínio.'
}

async function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}
    >
      <button
        type="submit"
        id="signout-btn"
        className="text-sm text-muted-foreground hover:text-destructive transition-colors"
      >
        Sair
      </button>
    </form>
  )
}

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
            <Link href="/dashboard/profile" className="flex items-center gap-2 group hover:bg-muted/50 p-1.5 pr-3 rounded-full transition-colors cursor-pointer" title="Meu Perfil">
              <div className="w-6 h-6 rounded-full brand-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white text-[10px] font-bold">
                  {session.user.name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground hidden sm:block font-medium transition-colors">
                {session.user.name ?? session.user.email}
              </span>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
    </div>
  )
}
