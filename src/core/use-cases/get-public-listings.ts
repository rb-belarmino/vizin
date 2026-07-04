import { Listing, ListingRepository } from '../entities/listing';

export interface GetPublicListingsRequest {
  searchQuery?: string;
  categoryId?: string;
}

export class GetPublicListings {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(request: GetPublicListingsRequest): Promise<Listing[]> {
    return this.listingRepository.findPublicListings({
      searchQuery: request.searchQuery,
      categoryId: request.categoryId,
    });
  }
}
