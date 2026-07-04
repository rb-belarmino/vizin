import { prisma } from '../../lib/prisma';

export class ResidentRepository {
  async createResident(data: { fullName: string; email: string; passwordHash: string; apartmentId: number }) {
    return prisma.user.create({
      data,
    });
  }

  async findResidentByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getResidentListings(providerId: string) {
    return prisma.serviceListing.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      include: { provider: { select: { fullName: true, apartmentId: true } } },
    });
  }

  async getListingById(id: string) {
    return prisma.serviceListing.findUnique({
      where: { id },
      include: { provider: { select: { fullName: true, apartmentId: true } } },
    });
  }

  async createListing(data: {
    title: string;
    description: string;
    categoryId: string;
    portfolioImageUrl: string;
    portfolioImageKey: string;
    priceBaseline?: string;
    whatsappNumber?: string;
    instagramHandle?: string;
    visibilityStatus: string;
    providerId: string;
  }) {
    return prisma.serviceListing.create({
      data,
    });
  }

  async updateListing(id: string, data: Partial<{
    title: string;
    description: string;
    categoryId: string;
    portfolioImageUrl: string;
    portfolioImageKey: string;
    priceBaseline?: string;
    whatsappNumber?: string;
    instagramHandle?: string;
    visibilityStatus: string;
  }>) {
    return prisma.serviceListing.update({
      where: { id },
      data,
    });
  }

  async deleteListing(id: string) {
    await prisma.serviceListing.delete({
      where: { id },
    });
    return true;
  }
}
