import { prisma } from '../../lib/prisma';
import { Listing, ListingRepository } from '../../core/entities/listing';

export class PrismaListingRepository implements ListingRepository {
  async findPublicListings(filters: {
    searchQuery?: string;
    categoryId?: string;
  }): Promise<Listing[]> {
    const where: Record<string, unknown> = {
      visibilityStatus: 'Public',
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { description: { contains: filters.searchQuery, mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.serviceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { fullName: true, apartmentId: true },
        },
        reviews: { select: { rating: true } },
      },
    });

    return listings.map((listing) => {
      const reviewCount = listing.reviews.length;
      const ratingAverage = reviewCount > 0 
        ? Math.round((listing.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount) * 10) / 10 
        : undefined;

      return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      categoryId: listing.categoryId,
      portfolioImageUrl: listing.portfolioImageUrl,
      portfolioImageKey: listing.portfolioImageKey,
      priceBaseline: listing.priceBaseline,
      whatsappNumber: listing.whatsappNumber,
      instagramHandle: listing.instagramHandle,
      visibilityStatus: listing.visibilityStatus,
      providerId: listing.providerId,
      providerName: listing.provider.fullName,
      providerApartmentId: listing.provider.apartmentId,
      ratingAverage,
      reviewCount,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };
  });
  }

  async findById(id: string): Promise<Listing | null> {
    const listing = await prisma.serviceListing.findUnique({
      where: { id },
      include: {
        provider: {
          select: { fullName: true, apartmentId: true },
        },
        reviews: { select: { rating: true } },
      },
    });

    if (!listing) return null;

    const reviewCount = listing.reviews.length;
    const ratingAverage = reviewCount > 0 
      ? Math.round((listing.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount) * 10) / 10 
      : undefined;

    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      categoryId: listing.categoryId,
      portfolioImageUrl: listing.portfolioImageUrl,
      portfolioImageKey: listing.portfolioImageKey,
      priceBaseline: listing.priceBaseline,
      whatsappNumber: listing.whatsappNumber,
      instagramHandle: listing.instagramHandle,
      visibilityStatus: listing.visibilityStatus,
      providerId: listing.providerId,
      providerName: listing.provider.fullName,
      providerApartmentId: listing.provider.apartmentId,
      ratingAverage,
      reviewCount,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };
  }
}
