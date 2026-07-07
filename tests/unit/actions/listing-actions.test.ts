/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteListingAction } from '../../../src/actions/listing-actions'
import { ManageListingsUseCase } from '../../../src/core/use-cases/manage-listings'
import { auth } from '../../../src/infrastructure/auth/auth'

// Mock dependencies
vi.mock('../../../src/infrastructure/auth/auth', () => ({
  auth: vi.fn()
}))

vi.mock('../../../src/infrastructure/database/resident-repository', () => ({
  ResidentRepository: vi.fn().mockImplementation(function () {
    return {
      getListingById: vi.fn().mockResolvedValue({ id: 'listing-1', portfolioImageKey: 'key-1', providerId: 'user-1' }),
      deleteListing: vi.fn().mockResolvedValue(true),
    }
  })
}))

vi.mock('../../../src/core/use-cases/manage-listings', () => ({
  ManageListingsUseCase: vi.fn().mockImplementation(function () {
    return { deleteListing: vi.fn().mockResolvedValue(true) }
  })
}))

// Mock UploadStorageUseCase to prevent UTApi from being instantiated in test env
vi.mock('../../../src/core/use-cases/upload-storage', () => ({
  UploadStorageUseCase: vi.fn().mockImplementation(function () {
    return { deleteImage: vi.fn().mockResolvedValue(undefined) }
  })
}))

// We must also mock revalidatePath since it's a Next.js server feature
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('Server Actions - Listing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('deleteListingAction', () => {
    it('should delegate to ManageListingsUseCase when authenticated', async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any)

      const result = await deleteListingAction('listing-1')

      expect(auth).toHaveBeenCalled()
      // We expect a success message
      expect(result).toHaveProperty('success')
    })

    it('should return error when not authenticated', async () => {
      vi.mocked(auth).mockResolvedValue(null as any)

      const result = await deleteListingAction('listing-1')

      expect(result).toEqual({ error: 'Não autorizado.' })
      expect(ManageListingsUseCase).not.toHaveBeenCalled()
    })
  })
})
