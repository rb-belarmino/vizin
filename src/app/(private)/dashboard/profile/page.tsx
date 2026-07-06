import { auth } from '@/infrastructure/auth/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PasswordForm } from '@/components/profile/PasswordForm';

export const metadata = {
  title: 'Meu Perfil - Vizin'
};

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { fullName: true, email: true, apartmentId: true }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
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
          <PasswordForm />
        </section>
      </div>
    </div>
  );
}
