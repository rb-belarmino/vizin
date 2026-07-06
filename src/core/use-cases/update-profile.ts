import { ResidentRepository } from '@/infrastructure/database/resident-repository';
import { UpdateProfileInput } from '@/actions/schemas/profile-schema';

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const repository = new ResidentRepository();
  // FR-014 requires email to be immutable, so we don't include it in update
  return await repository.updateResident(userId, {
    fullName: data.fullName,
    apartmentId: data.apartmentId,
  });
}
