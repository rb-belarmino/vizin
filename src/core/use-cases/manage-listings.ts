import { ResidentRepository } from '../../infrastructure/database/resident-repository';

export class ManageListingsUseCase {
  constructor(private residentRepository: ResidentRepository) {}

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

  async deleteListing(listingId: string) {
    return this.residentRepository.deleteListing(listingId);
  }
}
