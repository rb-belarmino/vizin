import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata = {
  title: 'Recuperar Senha - Vizin'
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <ForgotPasswordForm />
    </div>
  )
}
