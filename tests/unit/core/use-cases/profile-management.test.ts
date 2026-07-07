import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfileUseCase } from '@/core/use-cases/get-profile';
import { updateProfile } from '@/core/use-cases/update-profile';

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

describe('Profile Management Use Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfileUseCase', () => {
    it('should return profile successfully', async () => {
      mockFindResidentForAuth.mockResolvedValue({
        fullName: 'John Doe',
        email: 'john@example.com',
        apartmentId: '101',
        passwordHash: 'hash',
      });

      const profile = await getProfileUseCase('user-1');
      expect(profile).toEqual({
        fullName: 'John Doe',
        email: 'john@example.com',
        apartmentId: '101',
        hasPassword: true,
      });
    });

    it('should return null if user not found', async () => {
      mockFindResidentForAuth.mockResolvedValue(null);
      const profile = await getProfileUseCase('invalid');
      expect(profile).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      mockUpdateResident.mockResolvedValue({
        fullName: 'John Updated',
        apartmentId: '202'
      });

      const result = await updateProfile('user-1', {
        fullName: 'John Updated',
        apartmentId: '202',
      });

      expect(result).toEqual({ fullName: 'John Updated', apartmentId: '202' });
      expect(mockUpdateResident).toHaveBeenCalledWith('user-1', {
        fullName: 'John Updated',
        apartmentId: '202',
      });
    });
  });
});
