export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  authorId: string;
  authorName?: string;
  serviceListingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewRepository {
  createOrUpdate(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review>;
  delete(id: string, authorId: string): Promise<void>;
  findByListingId(listingId: string): Promise<Review[]>;
  findById(id: string): Promise<Review | null>;
}
