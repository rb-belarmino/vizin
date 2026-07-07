'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileInput } from '@/actions/schemas/profile-schema';
import { updateProfileAction } from '@/actions/profile-actions';

interface ProfileFormProps {
  initialData: {
    fullName: string;
    apartmentId: number | null; // null for OAuth users who haven't completed onboarding
    email: string; // read-only
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: initialData.fullName,
      apartmentId: initialData.apartmentId ?? 0, // fallback to 0 if null (onboarding not completed)
    }
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setStatus(null);
    const result = await updateProfileAction(data);
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else if (result.success) {
      setStatus({ type: 'success', message: result.success });
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
        <label className="block text-sm font-medium text-muted-foreground mb-1">E-mail (Não alterável)</label>
        <input 
          type="email" 
          value={initialData.email} 
          disabled 
          className="w-full p-2 rounded-md bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-70"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome Completo</label>
        <input 
          type="text" 
          {...register('fullName')}
          className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Número do Apartamento</label>
        <input 
          type="number" 
          {...register('apartmentId')}
          className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.apartmentId && <span className="text-red-500 text-xs mt-1 block">{errors.apartmentId.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-2 brand-gradient text-white rounded-md font-medium hover:-translate-y-0.5 transition-transform disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Perfil'}
      </button>
    </form>
  );
}
