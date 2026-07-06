import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Redefinir Senha - Vizin'
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <ResetPasswordForm token={searchParams.token} />
    </div>
  );
}
