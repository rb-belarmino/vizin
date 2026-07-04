import { z } from 'zod';

export const reviewSchema = z.object({
  serviceListingId: z.string().min(1, 'Serviço é obrigatório'),
  rating: z.number().int().min(1).max(5, 'A nota deve ser de 1 a 5'),
  comment: z.string().max(500, 'O comentário deve ter no máximo 500 caracteres').optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
