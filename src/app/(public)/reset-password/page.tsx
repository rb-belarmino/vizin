import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Redefinir Senha - Vizin'
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <ResetPasswordForm token={token} />
    </div>
  );
}
