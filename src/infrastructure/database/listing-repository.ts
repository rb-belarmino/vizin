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
      },
    });

    return listings.map((listing) => ({
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
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    }));
  }
}
