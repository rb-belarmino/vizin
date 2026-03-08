import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { LogoutButton } from '@/presentation/auth/logout-button'

export default async function DashboardPage() {
  // 1. Recover the session securely on the Server Side
  const session = await getServerSession(authOptions)

  // 2. Route Protection: Redirect unauthenticated users immediately
  if (!session || !session.user) {
    redirect('/login')
  }

  // 3. Destructure the user data to show on the UI
  const { name, email, role } = session.user as any

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Painel do Morador
            </h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo de volta,{' '}
              <span className="font-semibold text-slate-700">{name}</span>!
            </p>
          </div>
          <LogoutButton />
        </header>

        {/* Dashboard Grid Content */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Example Info Card */}
          <div className="rounded-xl border bg-white text-slate-950 shadow-sm p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              Meus Dados
            </h3>
            <div className="mt-4 text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-slate-700">E-mail:</strong> {email}
              </p>
              <p>
                <strong className="text-slate-700">Acesso:</strong>{' '}
                {role === 'resident' ? 'Morador' : 'Administrador'}
              </p>
            </div>
          </div>

          {/* Placeholder Card 1 */}
          <div className="rounded-xl border bg-white text-slate-950 shadow-sm p-6 flex flex-col items-center justify-center text-center opacity-70">
            <h3 className="font-semibold text-slate-400">Últimos Avisos</h3>
            <p className="text-xs text-slate-400 mt-2">
              Nenhum aviso no momento.
            </p>
          </div>

          {/* Placeholder Card 2 */}
          <div className="rounded-xl border bg-white text-slate-950 shadow-sm p-6 flex flex-col items-center justify-center text-center opacity-70">
            <h3 className="font-semibold text-slate-400">Reservar Espaço</h3>
            <p className="text-xs text-slate-400 mt-2">Em breve.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
