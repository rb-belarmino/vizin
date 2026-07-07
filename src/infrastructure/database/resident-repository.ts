import { prisma } from '../../lib/prisma';

export class ResidentRepository {
  async createResident(data: {
    fullName: string;
    email: string;
    passwordHash?: string | null; // Optional — not provided for OAuth users
    apartmentId?: number | null;  // Optional — collected in Onboarding for OAuth users
  }) {
    // NOTE: The `as any` cast is intentional. The Prisma Client types still reflect
    // the old schema (passwordHash and apartmentId as required). Once the migration
    // `004-google-login` runs and `prisma generate` is executed, these fields will
    // become optional in the generated types and this cast can be removed.
    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        ...(data.passwordHash !== undefined && { passwordHash: data.passwordHash }),
        ...(data.apartmentId !== undefined && { apartmentId: data.apartmentId }),
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    });
  }

  async findResidentByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findResidentById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { fullName: true, email: true, apartmentId: true }
    });
  }

  async findResidentForAuth(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateResident(id: string, data: { fullName?: string; apartmentId?: number; passwordHash?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async createPasswordResetToken(data: { email: string; token: string; expires: Date }) {
    return prisma.passwordResetToken.create({ data });
  }

  async findPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  }

  async deletePasswordResetToken(id: string) {
    return prisma.passwordResetToken.delete({ where: { id } });
  }

  async resetPasswordWithTransaction(userId: string, email: string, newPasswordHash: string) {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash }
      }),
      prisma.passwordResetToken.deleteMany({
        where: { email }
      })
    ]);
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
    showApartment?: boolean;
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
    showApartment?: boolean;
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
