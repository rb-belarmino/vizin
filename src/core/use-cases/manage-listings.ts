import { ResidentRepository } from '../../infrastructure/database/resident-repository';
import { IStorageService } from '../contracts/storage-service';

export class ManageListingsUseCase {
  constructor(
    private residentRepository: ResidentRepository,
    private storageService?: IStorageService
  ) {}

  async registerResident(data: any) {
    // Basic implementation for tests
    return this.residentRepository.createResident({
      ...data,
      passwordHash: 'hashed_password' // Will be real hash in real implementation
    });
  }

  async loginResident(email: string, password: string) {
    const user = await this.residentRepository.findResidentByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    // Verify password logic would go here
    return user;
  }

  async createListing(data: any) {
    return this.residentRepository.createListing(data);
  }

  async getResidentListings(providerId: string) {
    return this.residentRepository.getResidentListings(providerId);
  }

  async updateListing(listingId: string, data: any) {
    const existing = await this.residentRepository.getListingById(listingId);
    if (
      existing &&
      existing.portfolioImageKey &&
      data.portfolioImageKey &&
      existing.portfolioImageKey !== data.portfolioImageKey
    ) {
      if (this.storageService) {
        await this.storageService.deleteImage(existing.portfolioImageKey).catch(console.error);
      }
    }
    return this.residentRepository.updateListing(listingId, data);
  }

  async deleteListing(listingId: string) {
    const existing = await this.residentRepository.getListingById(listingId);
    if (existing && existing.portfolioImageKey) {
      if (this.storageService) {
        await this.storageService.deleteImage(existing.portfolioImageKey).catch(console.error);
      }
    }
    return this.residentRepository.deleteListing(listingId);
  }
}
