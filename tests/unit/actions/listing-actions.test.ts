import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteListingAction } from '../../../../src/actions/listing-actions';
import { ManageListingsUseCase } from '../../../../src/core/use-cases/manage-listings';
import { auth } from '../../../../src/infrastructure/auth/auth';

// Mock dependencies
vi.mock('../../../../src/infrastructure/auth/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('../../../../src/core/use-cases/manage-listings', () => {
  return {
    ManageListingsUseCase: vi.fn().mockImplementation(() => ({
      deleteListing: vi.fn().mockResolvedValue(true),
    })),
  };
});

// We must also mock revalidatePath since it's a Next.js server feature
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Server Actions - Listing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteListingAction', () => {
    it('should delegate to ManageListingsUseCase when authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any);
      
      const result = await deleteListingAction('listing-1');
      
      expect(auth).toHaveBeenCalled();
      // ManageListingsUseCase should have been instantiated
      expect(ManageListingsUseCase).toHaveBeenCalled();
      
      // We expect a success message
      expect(result).toHaveProperty('success');
    });

    it('should return error when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null);
      
      const result = await deleteListingAction('listing-1');
      
      expect(result).toEqual({ error: 'Não autorizado.' });
      expect(ManageListingsUseCase).not.toHaveBeenCalled();
    });
  });
});
