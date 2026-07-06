'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/actions/schemas/profile-schema';
import { forgotPasswordAction } from '@/actions/password-actions';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setStatus(null);
    const result = await forgotPasswordAction(data);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.success });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass p-8 rounded-2xl shadow-xl border border-white/10 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Recuperar Senha
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Digite seu e-mail para receber um link de redefinição.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {status && (
          <div className={`p-4 rounded-lg text-sm font-medium ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
            {status.message}
          </div>
        )}
        
        {status?.type !== 'success' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">E-mail Cadastrado</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                {...register('email')}
                className="w-full p-3 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1.5 block">{errors.email.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 brand-gradient text-white rounded-lg font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Link'}
            </button>
          </>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-primary hover:underline font-medium">
            Voltar para o Login
          </Link>
        </div>
      </form>
    </div>
  );
}
