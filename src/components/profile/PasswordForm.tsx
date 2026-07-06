'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordInput } from '@/actions/schemas/profile-schema';
import { changePasswordAction } from '@/actions/password-actions';

export function PasswordForm() {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setStatus(null);
    const result = await changePasswordAction(data);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.success });
      reset(); // clear fields on success
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {status && (
        <div className={`p-3 rounded text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          {status.message}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">Senha Atual</label>
        <input 
          type="password" 
          {...register('currentPassword')}
          className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.currentPassword && <span className="text-red-500 text-xs mt-1 block">{errors.currentPassword.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nova Senha</label>
        <input 
          type="password" 
          {...register('newPassword')}
          className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.newPassword && <span className="text-red-500 text-xs mt-1 block">{errors.newPassword.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-2 bg-muted text-foreground hover:bg-muted/80 rounded-md font-medium transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
      </button>
    </form>
  );
}
