import { prisma } from '@/lib/prisma';
import { UpdateProfileInput } from '@/actions/schemas/profile-schema';

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  // FR-014 requires email to be immutable, so we don't include it in update
  return await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      apartmentId: data.apartmentId,
    },
  });
}
