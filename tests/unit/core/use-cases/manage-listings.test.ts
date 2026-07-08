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
  deleteImage: vi.fn().mockResolvedValue(undefined),
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

  describe('registerResident', () => {
    it('should register a resident', async () => {
      mockResidentRepository.createResident.mockResolvedValue({ id: 'user-1' });
      const result = await useCase.registerResident({ email: 'test@test.com' });
      expect(result).toEqual({ id: 'user-1' });
      expect(mockResidentRepository.createResident).toHaveBeenCalledWith({ email: 'test@test.com', passwordHash: 'hashed_password' });
    });
  });

  describe('loginResident', () => {
    it('should login a resident successfully', async () => {
      mockResidentRepository.findResidentByEmail.mockResolvedValue({ id: 'user-1' });
      const result = await useCase.loginResident('test@test.com');
      expect(result).toEqual({ id: 'user-1' });
    });

    it('should throw if invalid credentials', async () => {
      mockResidentRepository.findResidentByEmail.mockResolvedValue(null);
      await expect(useCase.loginResident('test@test.com')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('createListing', () => {
    it('should create a listing', async () => {
      mockResidentRepository.createListing.mockResolvedValue({ id: 'listing-1' });
      const result = await useCase.createListing({ title: 'New' });
      expect(result).toEqual({ id: 'listing-1' });
      expect(mockResidentRepository.createListing).toHaveBeenCalledWith({ title: 'New' });
    });
  });

  describe('getResidentListings', () => {
    it('should get resident listings', async () => {
      mockResidentRepository.getResidentListings.mockResolvedValue([{ id: 'listing-1' }]);
      const result = await useCase.getResidentListings('provider-1');
      expect(result).toEqual([{ id: 'listing-1' }]);
    });
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

    it('should not attempt to delete image from storage if storageService is undefined when listing is deleted', async () => {
      const useCaseWithoutStorage = new ManageListingsUseCase(mockResidentRepository as unknown as ResidentRepository);
      const listingId = 'listing-1';
      const mockListing = { id: listingId, portfolioImageKey: 'image-123' };
      
      mockResidentRepository.getListingById.mockResolvedValue(mockListing);
      mockResidentRepository.deleteListing.mockResolvedValue(true);
      
      await useCaseWithoutStorage.deleteListing(listingId);
      
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

    it('should not attempt to delete old image when image key changes but storageService is undefined', async () => {
      const useCaseWithoutStorage = new ManageListingsUseCase(mockResidentRepository as unknown as ResidentRepository);
      const listingId = 'listing-1';
      const oldListing = { id: listingId, portfolioImageKey: 'old-123' };
      const updateData = { portfolioImageKey: 'new-123', title: 'New Title' };
      
      mockResidentRepository.getListingById.mockResolvedValue(oldListing);
      mockResidentRepository.updateListing.mockResolvedValue({ ...oldListing, ...updateData });
      
      await useCaseWithoutStorage.updateListing(listingId, updateData);
      
      expect(mockStorageService.deleteImage).not.toHaveBeenCalled();
      expect(mockResidentRepository.updateListing).toHaveBeenCalledWith(listingId, updateData);
    });
  });
});
