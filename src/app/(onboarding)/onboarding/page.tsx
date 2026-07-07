'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboardingAction } from '@/actions/onboarding-actions';
import { signOut } from 'next-auth/react';

export default function OnboardingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await completeOnboardingAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl animate-scale-up relative border border-white/10">
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="absolute top-4 right-4 text-xs font-medium text-white/50 hover:text-white transition-colors"
        >
          Sair
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Quase lá!</h1>
          <p className="text-white/70 text-sm">
            Para sua segurança e de seus vizinhos, precisamos saber o número do seu apartamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label htmlFor="apartmentId" className="block text-xs font-semibold text-white/80 uppercase tracking-wide">
              Número do Apartamento
            </label>
            <input
              id="apartmentId"
              name="apartmentId"
              type="number"
              placeholder="Ex: 101"
              required
              min="1"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl brand-gradient text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
          >
            {isPending ? 'Confirmando...' : 'Confirmar e Acessar'}
          </button>
        </form>
      </div>
    </div>
  );
}
