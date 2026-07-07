import { auth } from '@/infrastructure/auth/auth'
import { getProfileUseCase } from '@/core/use-cases/get-profile'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { PasswordForm } from '@/components/profile/PasswordForm'

export const metadata = {
  title: 'Meu Perfil - Vizin'
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await getProfileUseCase(session.user.id)

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Voltar para Meus Serviços
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e credenciais de acesso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dados Pessoais */}
        <section className="glass p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Informações Pessoais
          </h2>
          <ProfileForm initialData={user} />
        </section>

        {/* Segurança */}
        <section className="glass p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Segurança
          </h2>
          <PasswordForm hasPassword={user.hasPassword} />
        </section>
      </div>
    </div>
  )
}
