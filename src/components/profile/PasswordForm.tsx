'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPasswordSchema, SetPasswordInput, changePasswordSchema, ChangePasswordInput } from '@/actions/schemas/profile-schema';
import { changePasswordAction, setLocalPasswordAction } from '@/actions/password-actions';

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isHybrid, setIsHybrid] = useState(hasPassword);

  const setPasswordForm = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema)
  });

  const changePasswordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSetSubmit = async (data: SetPasswordInput) => {
    setStatus(null);
    const result = await setLocalPasswordAction(data);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.success });
      setPasswordForm.reset();
      setIsHybrid(true); // Switch to change password mode
    }
  };

  const onChangeSubmit = async (data: ChangePasswordInput) => {
    setStatus(null);
    const result = await changePasswordAction(data);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.success });
      changePasswordForm.reset();
    }
  };

  return (
    <div className="space-y-4">
      {status && (
        <div className={`p-3 rounded text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          {status.message}
        </div>
      )}

      {!isHybrid ? (
        <form onSubmit={setPasswordForm.handleSubmit(onSetSubmit)} className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-primary mb-1">Crie uma Senha Local</h3>
            <p className="text-sm text-muted-foreground">
              Você acessa a plataforma usando o Google. Se quiser, crie uma senha local abaixo. Isso permitirá que você faça login usando seu e-mail e esta senha futuramente.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nova Senha</label>
            <input 
              type="password" 
              {...setPasswordForm.register('newPassword')}
              className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {setPasswordForm.formState.errors.newPassword && <span className="text-red-500 text-xs mt-1 block">{setPasswordForm.formState.errors.newPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={setPasswordForm.formState.isSubmitting}
            className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {setPasswordForm.formState.isSubmitting ? 'Criando...' : 'Criar Senha'}
          </button>
        </form>
      ) : (
        <form onSubmit={changePasswordForm.handleSubmit(onChangeSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Senha Atual</label>
            <input 
              type="password" 
              {...changePasswordForm.register('currentPassword')}
              className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {changePasswordForm.formState.errors.currentPassword && <span className="text-red-500 text-xs mt-1 block">{changePasswordForm.formState.errors.currentPassword.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nova Senha</label>
            <input 
              type="password" 
              {...changePasswordForm.register('newPassword')}
              className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {changePasswordForm.formState.errors.newPassword && <span className="text-red-500 text-xs mt-1 block">{changePasswordForm.formState.errors.newPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={changePasswordForm.formState.isSubmitting}
            className="w-full py-2 bg-muted text-foreground hover:bg-muted/80 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {changePasswordForm.formState.isSubmitting ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      )}
    </div>
  );
}
