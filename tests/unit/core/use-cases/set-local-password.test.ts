import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setLocalPassword } from '@/core/use-cases/set-local-password';
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

describe('Set Local Password Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set local password successfully for OAuth user', async () => {
    mockFindResidentForAuth.mockResolvedValue({
      id: 'user-1',
      passwordHash: null,
    });
    vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);

    const result = await setLocalPassword('user-1', 'new-password');

    expect(result).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
    expect(mockUpdateResident).toHaveBeenCalledWith('user-1', { passwordHash: 'new-hash' });
  });

  it('should throw error if user not found', async () => {
    mockFindResidentForAuth.mockResolvedValue(null);

    await expect(setLocalPassword('user-1', 'new')).rejects.toThrow('Usuário não encontrado.');
  });

  it('should throw error if user already has a password', async () => {
    mockFindResidentForAuth.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'existing-hash',
    });

    await expect(setLocalPassword('user-1', 'new')).rejects.toThrow('Você já possui uma senha cadastrada. Use a opção de alterar senha.');
  });
});
