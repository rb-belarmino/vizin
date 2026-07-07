import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateResetToken, validateResetToken } from '@/core/use-cases/reset-password';
import { ResidentRepository } from '@/infrastructure/database/resident-repository';
import { sendEmail } from '@/infrastructure/email/mailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const mockFindResidentByEmail = vi.fn();
const mockCreatePasswordResetToken = vi.fn();
const mockFindPasswordResetToken = vi.fn();
const mockDeletePasswordResetToken = vi.fn();
const mockResetPasswordWithTransaction = vi.fn();

vi.mock('@/infrastructure/database/resident-repository', () => {
  return {
    ResidentRepository: vi.fn().mockImplementation(function() {
      return {
        findResidentByEmail: mockFindResidentByEmail,
        createPasswordResetToken: mockCreatePasswordResetToken,
        findPasswordResetToken: mockFindPasswordResetToken,
        deletePasswordResetToken: mockDeletePasswordResetToken,
        resetPasswordWithTransaction: mockResetPasswordWithTransaction,
      };
    })
  };
});

vi.mock('@/infrastructure/email/mailer', () => ({
  sendEmail: vi.fn()
}));

vi.mock('bcryptjs');

vi.mock('crypto', async (importOriginal) => {
  const mod = await importOriginal<typeof import('crypto')>();
  return {
    default: {
      ...mod,
      randomBytes: vi.fn()
    }
  };
});

describe('Reset Password Use Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateResetToken', () => {
    it('should generate a token and send email', async () => {
      mockFindResidentByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        passwordHash: 'hash'
      });
      vi.mocked(crypto.randomBytes).mockReturnValue({ toString: () => 'mock-token' } as any);
      vi.mocked(sendEmail).mockResolvedValue({ data: { id: 'email-id' } } as any);

      const result = await generateResetToken('test@example.com');
      
      expect(result).toBe(true);
      expect(mockCreatePasswordResetToken).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'mock-token',
        expires: expect.any(Date)
      });
      expect(sendEmail).toHaveBeenCalled();
    });

    it('should throw if email not found', async () => {
      mockFindResidentByEmail.mockResolvedValue(null);
      await expect(generateResetToken('test@example.com')).rejects.toThrow('Email not found');
    });

    it('should throw if user is OAuth-only (no password)', async () => {
      mockFindResidentByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: null
      });
      await expect(generateResetToken('test@example.com')).rejects.toThrow('Esta conta usa login pelo Google e não possui senha. Acesse com sua conta Google.');
    });

    it('should throw if email sending fails', async () => {
      mockFindResidentByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        passwordHash: 'hash'
      });
      vi.mocked(crypto.randomBytes).mockReturnValue({ toString: () => 'mock-token' } as any);
      vi.mocked(sendEmail).mockResolvedValue({ error: { message: 'Network error', name: 'Error' } });

      await expect(generateResetToken('test@example.com')).rejects.toThrow('Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.');
    });
  });

  describe('validateResetToken', () => {
    it('should validate token and reset password', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      
      mockFindPasswordResetToken.mockResolvedValue({
        id: 'token-1',
        email: 'test@example.com',
        expires: futureDate
      });
      mockFindResidentByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com'
      });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);

      const result = await validateResetToken('valid-token', 'new-password');

      expect(result).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);
      expect(mockResetPasswordWithTransaction).toHaveBeenCalledWith('user-1', 'test@example.com', 'new-hash');
    });

    it('should throw if token is invalid or not found', async () => {
      mockFindPasswordResetToken.mockResolvedValue(null);
      await expect(validateResetToken('invalid-token', 'new')).rejects.toThrow('Token inválido ou expirado.');
    });

    it('should throw if token is expired', async () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);
      
      mockFindPasswordResetToken.mockResolvedValue({
        id: 'token-1',
        email: 'test@example.com',
        expires: pastDate
      });

      await expect(validateResetToken('expired-token', 'new')).rejects.toThrow('Token expirado. Por favor, solicite um novo.');
      expect(mockDeletePasswordResetToken).toHaveBeenCalledWith('token-1');
    });

    it('should throw if user associated with valid token is not found', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      
      mockFindPasswordResetToken.mockResolvedValue({
        id: 'token-1',
        email: 'test@example.com',
        expires: futureDate
      });
      mockFindResidentByEmail.mockResolvedValue(null);

      await expect(validateResetToken('valid-token', 'new-password')).rejects.toThrow('Usuário não encontrado.');
    });
  });
});
