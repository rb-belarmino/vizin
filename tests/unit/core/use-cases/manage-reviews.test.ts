import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageReviewsUseCase } from '@/core/use-cases/reviews/manage-reviews';

describe('Manage Reviews Use Case', () => {
  let mockReviewRepository: any;
  let mockListingRepository: any;

  beforeEach(() => {
    mockReviewRepository = {
      createOrUpdate: vi.fn(),
      delete: vi.fn(),
    };
    mockListingRepository = {
      findById: vi.fn(),
    };
  });

  describe('submitReview', () => {
    it('should submit a review successfully', async () => {
      mockListingRepository.findById.mockResolvedValue({
        id: 'listing-1',
        providerId: 'provider-1',
      });
      mockReviewRepository.createOrUpdate.mockResolvedValue({ id: 'review-1' });

      const useCase = new ManageReviewsUseCase(mockReviewRepository, mockListingRepository);
      
      const result = await useCase.submitReview({
        authorId: 'user-1',
        serviceListingId: 'listing-1',
        rating: 5,
        comment: 'Great service'
      } as any);

      expect(result).toEqual({ id: 'review-1' });
      expect(mockListingRepository.findById).toHaveBeenCalledWith('listing-1');
      expect(mockReviewRepository.createOrUpdate).toHaveBeenCalledWith({
        authorId: 'user-1',
        serviceListingId: 'listing-1',
        rating: 5,
        comment: 'Great service'
      });
    });

    it('should throw error if listing is not found', async () => {
      mockListingRepository.findById.mockResolvedValue(null);

      const useCase = new ManageReviewsUseCase(mockReviewRepository, mockListingRepository);

      await expect(useCase.submitReview({
        authorId: 'user-1',
        serviceListingId: 'listing-1',
        rating: 5,
      } as any)).rejects.toThrow('Serviço não encontrado');
    });

    it('should throw error if author tries to review their own listing', async () => {
      mockListingRepository.findById.mockResolvedValue({
        id: 'listing-1',
        providerId: 'user-1', // same as authorId
      });

      const useCase = new ManageReviewsUseCase(mockReviewRepository, mockListingRepository);

      await expect(useCase.submitReview({
        authorId: 'user-1',
        serviceListingId: 'listing-1',
        rating: 5,
      } as any)).rejects.toThrow('Você não pode avaliar o seu próprio serviço');
    });
  });

  describe('deleteReview', () => {
    it('should call repository delete', async () => {
      mockReviewRepository.delete.mockResolvedValue(true);

      const useCase = new ManageReviewsUseCase(mockReviewRepository, mockListingRepository);
      const result = await useCase.deleteReview('review-1', 'user-1');

      expect(result).toBe(true);
      expect(mockReviewRepository.delete).toHaveBeenCalledWith('review-1', 'user-1');
    });
  });
});
