import { ResidentRepository } from '@/infrastructure/database/resident-repository';
import bcrypt from 'bcryptjs';

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const repository = new ResidentRepository();
  const user = await repository.findResidentForAuth(userId);

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('A senha atual está incorreta.');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await repository.updateResident(userId, { passwordHash: newPasswordHash });

  return true;
}
