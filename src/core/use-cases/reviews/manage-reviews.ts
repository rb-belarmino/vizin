import { ReviewRepository, Review } from '../../entities/review';
import { ListingRepository } from '../../entities/listing';

export class ManageReviewsUseCase {
  constructor(
    private reviewRepository: ReviewRepository,
    private listingRepository: ListingRepository
  ) {}

  async submitReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) {
    const listing = await this.listingRepository.findById(data.serviceListingId);
    
    if (!listing) {
      throw new Error('Serviço não encontrado');
    }

    if (listing.providerId === data.authorId) {
      throw new Error('Você não pode avaliar o seu próprio serviço');
    }

    return this.reviewRepository.createOrUpdate(data);
  }

  async deleteReview(reviewId: string, authorId: string) {
    return this.reviewRepository.delete(reviewId, authorId);
  }
}
