'use server'

import { reviewSchema, ReviewInput } from './schemas/review.schema'
import { PrismaReviewRepository } from '../infrastructure/database/review-repository'
import { PrismaListingRepository } from '../infrastructure/database/listing-repository'
import { ManageReviewsUseCase } from '../core/use-cases/reviews/manage-reviews'
import { auth } from '../infrastructure/auth/auth'
import { revalidatePath } from 'next/cache'

export async function submitReviewAction(data: ReviewInput) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Não autorizado. Faça login para avaliar.' }
  }

  const parsed = reviewSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Dados inválidos.', details: parsed.error.flatten() }
  }

  const reviewRepository = new PrismaReviewRepository()
  const listingRepository = new PrismaListingRepository()
  const manageReviews = new ManageReviewsUseCase(reviewRepository, listingRepository)

  try {
    await manageReviews.submitReview({
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
      serviceListingId: parsed.data.serviceListingId,
      authorId: session.user.id
    })

    revalidatePath(`/listing/${parsed.data.serviceListingId}`)
    revalidatePath('/')

    return { success: 'Avaliação enviada com sucesso!' }
  } catch (error: any) {
    console.error('Failed to submit review:', error)
    return { error: error.message || 'Falha ao enviar a avaliação.' }
  }
}

export async function deleteReviewAction(reviewId: string, serviceListingId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Não autorizado.' }
  }

  const reviewRepository = new PrismaReviewRepository()
  const listingRepository = new PrismaListingRepository()
  const manageReviews = new ManageReviewsUseCase(reviewRepository, listingRepository)

  try {
    await manageReviews.deleteReview(reviewId, session.user.id)

    revalidatePath(`/listing/${serviceListingId}`)
    revalidatePath('/')

    return { success: 'Avaliação excluída com sucesso!' }
  } catch (error: any) {
    console.error('Failed to delete review:', error)
    return { error: error.message || 'Falha ao excluir a avaliação.' }
  }
}
