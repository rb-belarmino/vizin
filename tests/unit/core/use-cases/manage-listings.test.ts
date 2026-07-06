import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageListingsUseCase } from '../../../../src/core/use-cases/manage-listings';
import { ResidentRepository } from '../../../../src/infrastructure/database/resident-repository';
import { IStorageService } from '../../../../src/core/contracts/storage-service';

// Mock dependencies
const mockResidentRepository = {
  createResident: vi.fn(),
  findResidentByEmail: vi.fn(),
  getResidentListings: vi.fn(),
  createListing: vi.fn(),
  updateListing: vi.fn(),
  deleteListing: vi.fn(),
  getListingById: vi.fn(),
};

const mockStorageService = {
  deleteImage: vi.fn(),
};

describe('Manage Listings Use Case (US2 - Garbage Collection TDD)', () => {
  let useCase: ManageListingsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ManageListingsUseCase(
      mockResidentRepository as unknown as ResidentRepository,
      mockStorageService as unknown as IStorageService
    );
  });

  describe('deleteListing', () => {
    it('should delete image from storage when listing is deleted', async () => {
      const listingId = 'listing-1';
      const mockListing = { id: listingId, portfolioImageKey: 'image-123' };
      
      mockResidentRepository.getListingById.mockResolvedValue(mockListing);
      mockResidentRepository.deleteListing.mockResolvedValue(true);
      
      await useCase.deleteListing(listingId);
      
      expect(mockResidentRepository.getListingById).toHaveBeenCalledWith(listingId);
      expect(mockStorageService.deleteImage).toHaveBeenCalledWith('image-123');
      expect(mockResidentRepository.deleteListing).toHaveBeenCalledWith(listingId);
      expect(result).toBe(true);
    });

    it('should not throw if listing has no image key', async () => {
      const listingId = 'listing-1';
      const mockListing = { id: listingId, portfolioImageKey: null };
      
      mockResidentRepository.getListingById.mockResolvedValue(mockListing);
      mockResidentRepository.deleteListing.mockResolvedValue(true);
      
      await useCase.deleteListing(listingId);
      
      expect(mockStorageService.deleteImage).not.toHaveBeenCalled();
      expect(mockResidentRepository.deleteListing).toHaveBeenCalledWith(listingId);
    });
  });

  describe('updateListing', () => {
    it('should delete old image when image key changes', async () => {
      const listingId = 'listing-1';
      const oldListing = { id: listingId, portfolioImageKey: 'old-123' };
      const updateData = { portfolioImageKey: 'new-123', title: 'New Title' };
      
      mockResidentRepository.getListingById.mockResolvedValue(oldListing);
      mockResidentRepository.updateListing.mockResolvedValue({ ...oldListing, ...updateData });
      
      await useCase.updateListing(listingId, updateData);
      
      expect(mockStorageService.deleteImage).toHaveBeenCalledWith('old-123');
      expect(mockResidentRepository.updateListing).toHaveBeenCalledWith(listingId, updateData);
    });

    it('should not delete old image when image key remains the same', async () => {
      const listingId = 'listing-1';
      const oldListing = { id: listingId, portfolioImageKey: 'old-123' };
      const updateData = { portfolioImageKey: 'old-123', title: 'New Title' };
      
      mockResidentRepository.getListingById.mockResolvedValue(oldListing);
      
      await useCase.updateListing(listingId, updateData);
      
      expect(mockStorageService.deleteImage).not.toHaveBeenCalled();
      expect(mockResidentRepository.updateListing).toHaveBeenCalledWith(listingId, updateData);
    });
  });
});
