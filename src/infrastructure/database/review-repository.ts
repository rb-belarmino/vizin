import { prisma } from '../../lib/prisma';
import { Review, ReviewRepository } from '../../core/entities/review';

export class PrismaReviewRepository implements ReviewRepository {
  async createOrUpdate(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const review = await prisma.review.upsert({
      where: {
        authorId_serviceListingId: {
          authorId: data.authorId,
          serviceListingId: data.serviceListingId,
        },
      },
      update: {
        rating: data.rating,
        comment: data.comment,
      },
      create: {
        rating: data.rating,
        comment: data.comment,
        authorId: data.authorId,
        serviceListingId: data.serviceListingId,
      },
    });

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      authorId: review.authorId,
      serviceListingId: review.serviceListingId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async delete(id: string, authorId: string): Promise<void> {
    await prisma.review.deleteMany({
      where: {
        id,
        authorId, // Ensure that the author deleting the review is actually the owner
      },
    });
  }

  async findByListingId(listingId: string): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { serviceListingId: listingId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { fullName: true }
        }
      }
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      authorId: r.authorId,
      authorName: r.author.fullName,
      serviceListingId: r.serviceListingId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async findById(id: string): Promise<Review | null> {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) return null;

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      authorId: review.authorId,
      serviceListingId: review.serviceListingId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
