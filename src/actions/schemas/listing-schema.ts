import { z } from 'zod'

export const ListingSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long.' }),
  categoryId: z.string().min(1, { message: 'Category is required.' }),
  portfolioImageUrl: z.string().url({ message: 'Invalid image URL.' }),
  portfolioImageKey: z.string().min(1, { message: 'Image key is required.' }),
  priceBaseline: z.string().optional(),
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
  visibilityStatus: z.enum(['Public', 'Private'])
})

export type ListingSchemaType = z.infer<typeof ListingSchema>
