export type ListingCategory = 
  | 'Gastronomia'
  | 'Reformas'
  | 'Aulas'
  | 'Beleza'
  | 'Saúde'
  | 'Outros';

export type VisibilityStatus = 'Public' | 'Hidden';

export interface Listing {
  id: string;
  title: string;
  description: string;
  categoryId: string; // Storing as string to match Prisma, but we validate it against ListingCategory
  portfolioImageUrl: string;
  portfolioImageKey: string;
  priceBaseline: string | null;
  whatsappNumber: string | null;
  instagramHandle: string | null;
  visibilityStatus: string;
  providerId: string;
  providerName?: string;
  providerApartmentId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListingRepository {
  findPublicListings(filters: {
    searchQuery?: string;
    categoryId?: string;
  }): Promise<Listing[]>;
}
