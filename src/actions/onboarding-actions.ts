'use server';

import { auth, update } from '../infrastructure/auth/auth';
import { onboardingSchema } from './schemas/onboarding-schema';
import { CompleteOnboardingUseCase } from '../core/use-cases/complete-onboarding';
import { ResidentRepository } from '../infrastructure/database/resident-repository';

export async function completeOnboardingAction(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Não autorizado.' };
  }

  const apartmentIdRaw = formData.get('apartmentId');
  const parsed = onboardingSchema.safeParse({ apartmentId: apartmentIdRaw });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const repository = new ResidentRepository();
    const useCase = new CompleteOnboardingUseCase(repository);
    
    console.log('[completeOnboardingAction] Session user ID:', session.user.id);
    
    const dbUserCheck = await repository.findResidentById(session.user.id);
    console.log('[completeOnboardingAction] DB User check:', dbUserCheck);

    await useCase.execute({
      userId: session.user.id,
      apartmentId: parsed.data.apartmentId,
    });

    // Update the session token with the new apartmentId
    await update({ user: { apartmentId: parsed.data.apartmentId } });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to complete onboarding:', error);
    return { error: error.message || 'Falha ao concluir onboarding.' };
  }
}
