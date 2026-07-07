import { ResidentRepository } from '../../infrastructure/database/resident-repository';

export async function getProfileUseCase(userId: string) {
  const repository = new ResidentRepository();
  const user = await repository.findResidentForAuth(userId);
  
  if (!user) return null;

  return {
    fullName: user.fullName,
    email: user.email,
    apartmentId: user.apartmentId,
    hasPassword: !!user.passwordHash,
  };
}
