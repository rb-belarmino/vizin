import { ResidentRepository } from '../../infrastructure/database/resident-repository';

export async function getProfileUseCase(userId: string) {
  const repository = new ResidentRepository();
  const user = await repository.findResidentById(userId);
  return user;
}
