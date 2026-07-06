'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  resetPasswordSchema,
  ResetPasswordInput
} from '@/actions/schemas/profile-schema'
import { resetPasswordAction } from '@/actions/password-actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token }
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    setStatus(null)
    const result = await resetPasswordAction(data)
    if (result.error) {
      setStatus({ type: 'error', message: result.error })
    } else if (result.success) {
      setStatus({ type: 'success', message: result.success })
      // Optional: redirect after some time
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card p-8 rounded-2xl shadow-xl border border-border animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          Nova Senha
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Crie uma nova senha segura para sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {status && (
          <div
            className={`p-4 rounded-lg text-sm font-medium ${status.type === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
          >
            {status.message}
          </div>
        )}

        {status?.type !== 'success' && (
          <>
            <input type="hidden" {...register('token')} />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nova Senha
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register('newPassword')}
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {errors.newPassword && (
                <span className="text-destructive text-xs mt-1.5 block font-medium">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 brand-gradient text-white rounded-lg font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </>
        )}

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium hover:underline underline-offset-4"
          >
            Ir para o Login
          </Link>
        </div>
      </form>
    </div>
  )
}
