import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageListingsUseCase } from '../../../../src/core/use-cases/manage-listings';
import { ResidentRepository } from '../../../../src/infrastructure/database/resident-repository';

// Mock dependencies
const mockResidentRepository = {
  createResident: vi.fn(),
  findResidentByEmail: vi.fn(),
  getResidentListings: vi.fn(),
  createListing: vi.fn(),
  updateListing: vi.fn(),
  deleteListing: vi.fn(),
};

describe('Manage Listings Use Case', () => {
  let useCase: ManageListingsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ManageListingsUseCase(mockResidentRepository as unknown as ResidentRepository);
  });

  describe('Authentication and Registration', () => {
    it('should register a new resident', async () => {
      const mockResidentData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        apartmentId: 101,
      };

      const expectedResident = { id: 'user-1', ...mockResidentData, passwordHash: 'hashed_password' };
      mockResidentRepository.createResident.mockResolvedValue(expectedResident);

      const result = await useCase.registerResident(mockResidentData);

      expect(mockResidentRepository.createResident).toHaveBeenCalled();
      expect(result).toEqual(expectedResident);
    });

    it('should login an existing resident', async () => {
      const email = 'john@example.com';
      const password = 'password123';
      
      const mockResident = { id: 'user-1', email, passwordHash: 'hashed_password' };
      mockResidentRepository.findResidentByEmail.mockResolvedValue(mockResident);
      
      const result = await useCase.loginResident(email, password);
      
      expect(mockResidentRepository.findResidentByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockResident);
    });
  });

  describe('Listing CRUD', () => {
    it('should create a listing for a resident', async () => {
      const listingData = {
        title: 'Cleaning Service',
        description: 'House cleaning',
        categoryId: 'cat-1',
        portfolioImageUrl: 'http://example.com/image.jpg',
        portfolioImageKey: 'image-key',
        providerId: 'user-1',
      };
      const expectedListing = { id: 'listing-1', ...listingData, visibilityStatus: 'Public' };
      mockResidentRepository.createListing.mockResolvedValue(expectedListing);

      const result = await useCase.createListing(listingData);

      expect(mockResidentRepository.createListing).toHaveBeenCalledWith(listingData);
      expect(result).toEqual(expectedListing);
    });

    it('should get all listings for a resident', async () => {
      const providerId = 'user-1';
      const expectedListings = [
        { id: 'listing-1', title: 'Cleaning Service' },
      ];
      mockResidentRepository.getResidentListings.mockResolvedValue(expectedListings);

      const result = await useCase.getResidentListings(providerId);

      expect(mockResidentRepository.getResidentListings).toHaveBeenCalledWith(providerId);
      expect(result).toEqual(expectedListings);
    });
    
    it('should delete a listing', async () => {
      const listingId = 'listing-1';
      mockResidentRepository.deleteListing.mockResolvedValue(true);

      const result = await useCase.deleteListing(listingId);

      expect(mockResidentRepository.deleteListing).toHaveBeenCalledWith(listingId);
      expect(result).toBe(true);
    });
  });
});
