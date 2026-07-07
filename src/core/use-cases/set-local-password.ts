import { ResidentRepository } from '@/infrastructure/database/resident-repository';
import bcrypt from 'bcryptjs';

export async function setLocalPassword(userId: string, newPassword: string) {
  const repository = new ResidentRepository();
  const user = await repository.findResidentForAuth(userId);

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  // Guard: Only allow if they DON'T have a password yet
  if (user.passwordHash) {
    throw new Error('Você já possui uma senha cadastrada. Use a opção de alterar senha.');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await repository.updateResident(userId, { passwordHash: newPasswordHash });

  return true;
}
