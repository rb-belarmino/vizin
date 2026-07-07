import { z } from 'zod';

export const onboardingSchema = z.object({
  apartmentId: z.coerce.number().int().min(1, 'Número do apartamento deve ser maior que 0.'),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
