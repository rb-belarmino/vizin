import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getListingDetailsUseCase, getListingReviewsUseCase } from '@/core/use-cases/get-listing-details';
import { PrismaListingRepository } from '@/infrastructure/database/listing-repository';
import { PrismaReviewRepository } from '@/infrastructure/database/review-repository';

const mockFindById = vi.fn();
const mockFindByListingId = vi.fn();

vi.mock('@/infrastructure/database/listing-repository', () => {
  return {
    PrismaListingRepository: vi.fn().mockImplementation(function() {
      return {
        findById: mockFindById,
      };
    })
  };
});

vi.mock('@/infrastructure/database/review-repository', () => {
  return {
    PrismaReviewRepository: vi.fn().mockImplementation(function() {
      return {
        findByListingId: mockFindByListingId,
      };
    })
  };
});

describe('Get Listing Details Use Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getListingDetailsUseCase', () => {
    it('should retrieve listing details successfully', async () => {
      mockFindById.mockResolvedValue({
        id: 'listing-1',
        title: 'Test Listing',
        description: 'Test description',
      });

      const result = await getListingDetailsUseCase('listing-1');

      expect(result).toEqual({
        id: 'listing-1',
        title: 'Test Listing',
        description: 'Test description',
      });
      expect(mockFindById).toHaveBeenCalledWith('listing-1');
    });

    it('should return null if listing is not found', async () => {
      mockFindById.mockResolvedValue(null);

      const result = await getListingDetailsUseCase('invalid-id');

      expect(result).toBeNull();
      expect(mockFindById).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('getListingReviewsUseCase', () => {
    it('should retrieve listing reviews successfully', async () => {
      mockFindByListingId.mockResolvedValue([
        { id: 'review-1', rating: 5, comment: 'Great!' }
      ]);

      const result = await getListingReviewsUseCase('listing-1');

      expect(result).toEqual([
        { id: 'review-1', rating: 5, comment: 'Great!' }
      ]);
      expect(mockFindByListingId).toHaveBeenCalledWith('listing-1');
    });

    it('should return empty array if no reviews found', async () => {
      mockFindByListingId.mockResolvedValue([]);

      const result = await getListingReviewsUseCase('listing-1');

      expect(result).toEqual([]);
      expect(mockFindByListingId).toHaveBeenCalledWith('listing-1');
    });
  });
});
