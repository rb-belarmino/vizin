import { PrismaListingRepository } from '../../infrastructure/database/listing-repository';
import { PrismaReviewRepository } from '../../infrastructure/database/review-repository';

export async function getListingDetailsUseCase(listingId: string) {
  const listingRepository = new PrismaListingRepository();
  const listing = await listingRepository.findById(listingId);
  return listing;
}

export async function getListingReviewsUseCase(listingId: string) {
  const reviewRepository = new PrismaReviewRepository();
  const reviews = await reviewRepository.findByListingId(listingId);
  return reviews;
}
