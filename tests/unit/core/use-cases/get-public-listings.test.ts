import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPublicListings } from '../../../../src/core/use-cases/get-public-listings';
import { Listing, ListingCategory } from '../../../../src/core/entities/listing';

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Plumber',
    description: 'Fix pipes',
    categoryId: 'Reformas',
    portfolioImageUrl: 'http://example.com/img1',
    portfolioImageKey: 'key1',
    priceBaseline: '100',
    whatsappNumber: '11999999999',
    instagramHandle: 'plumber_joe',
    visibilityStatus: 'Public',
    providerId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Chef',
    description: 'Cook food',
    categoryId: 'Gastronomia',
    portfolioImageUrl: 'http://example.com/img2',
    portfolioImageKey: 'key2',
    priceBaseline: '50',
    whatsappNumber: '11888888888',
    instagramHandle: null,
    visibilityStatus: 'Public',
    providerId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockRepository = {
  findPublicListings: vi.fn(),
};

describe('GetPublicListings Use Case', () => {
  let useCase: GetPublicListings;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetPublicListings(mockRepository as any);
  });

  it('should fetch all public listings when no filters are provided', async () => {
    mockRepository.findPublicListings.mockResolvedValue(mockListings);

    const result = await useCase.execute({});

    expect(mockRepository.findPublicListings).toHaveBeenCalledWith({});
    expect(result).toHaveLength(2);
    expect(result).toEqual(mockListings);
  });

  it('should filter by category if provided', async () => {
    const filteredListings = [mockListings[1]];
    mockRepository.findPublicListings.mockResolvedValue(filteredListings);

    const result = await useCase.execute({ categoryId: 'Gastronomia' });

    expect(mockRepository.findPublicListings).toHaveBeenCalledWith({ categoryId: 'Gastronomia' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Chef');
  });

  it('should filter by search query if provided', async () => {
    const searchListings = [mockListings[0]];
    mockRepository.findPublicListings.mockResolvedValue(searchListings);

    const result = await useCase.execute({ searchQuery: 'Plum' });

    expect(mockRepository.findPublicListings).toHaveBeenCalledWith({ searchQuery: 'Plum' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Plumber');
  });
});
