import { describe, it, expect, vi, beforeEach } from 'vitest';
import { changePassword } from '@/core/use-cases/change-password';
import { ResidentRepository } from '@/infrastructure/database/resident-repository';
import bcrypt from 'bcryptjs';

const mockFindResidentForAuth = vi.fn();
const mockUpdateResident = vi.fn();

vi.mock('@/infrastructure/database/resident-repository', () => {
  return {
    ResidentRepository: vi.fn().mockImplementation(function() {
      return {
        findResidentForAuth: mockFindResidentForAuth,
        updateResident: mockUpdateResident,
      };
    })
  };
});

vi.mock('bcryptjs');

describe('Change Password Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should change password successfully', async () => {
    mockFindResidentForAuth.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'old-hash',
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);

    const result = await changePassword('user-1', 'old-password', 'new-password');

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('old-password', 'old-hash');
    expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
    expect(mockUpdateResident).toHaveBeenCalledWith('user-1', { passwordHash: 'new-hash' });
  });

  it('should throw error if user not found', async () => {
    mockFindResidentForAuth.mockResolvedValue(null);

    await expect(changePassword('user-1', 'old', 'new')).rejects.toThrow('Usuário não encontrado.');
  });

  it('should throw error if user uses OAuth only (no password hash)', async () => {
    mockFindResidentForAuth.mockResolvedValue({
      id: 'user-1',
      passwordHash: null,
    });

    await expect(changePassword('user-1', 'old', 'new')).rejects.toThrow('Sua conta usa login pelo Google e não possui senha. Acesse com sua conta Google.');
  });

  it('should throw error if current password is wrong', async () => {
    mockFindResidentForAuth.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'old-hash',
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(changePassword('user-1', 'wrong-old', 'new')).rejects.toThrow('A senha atual está incorreta.');
  });
});
