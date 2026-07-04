import { z } from 'zod';

export const getPublicListingsSchema = z.object({
  searchQuery: z.string().optional(),
  categoryId: z.string().optional(), // Could be enum, but string is more forgiving for query params
});

export type GetPublicListingsParams = z.infer<typeof getPublicListingsSchema>;
