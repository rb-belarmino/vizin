import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CompleteOnboardingUseCase } from '../../../../src/core/use-cases/complete-onboarding'
import { ResidentRepository } from '../../../../src/infrastructure/database/resident-repository'

vi.mock('../../../../src/infrastructure/database/resident-repository', () => ({
  ResidentRepository: vi.fn().mockImplementation(function() {
    return {
      findResidentById: vi.fn().mockResolvedValue({
        id: 'user-1',
        fullName: 'John Doe',
        email: 'john@example.com',
        apartmentId: null,
      }),
      updateResident: vi.fn().mockResolvedValue({
        id: 'user-1',
        apartmentId: 101,
      })
    }
  })
}))

describe('CompleteOnboardingUseCase', () => {
  let repository: ResidentRepository
  let useCase: CompleteOnboardingUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new ResidentRepository()
    useCase = new CompleteOnboardingUseCase(repository)
  })

  it('should update the user with the provided apartmentId', async () => {
    const result = await useCase.execute({ userId: 'user-1', apartmentId: 101 })

    expect(repository.findResidentById).toHaveBeenCalledWith('user-1')
    expect(repository.updateResident).toHaveBeenCalledWith('user-1', { apartmentId: 101 })
    expect(result).toHaveProperty('id', 'user-1')
    expect(result).toHaveProperty('apartmentId', 101)
  })

  it('should throw an error if the user is not found', async () => {
    vi.mocked(repository.findResidentById).mockResolvedValueOnce(null)

    await expect(useCase.execute({ userId: 'user-2', apartmentId: 101 }))
      .rejects.toThrow('User not found.')
  })

  it('should throw an error if the user already has an apartmentId', async () => {
    vi.mocked(repository.findResidentById).mockResolvedValueOnce({
      id: 'user-3',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      apartmentId: 202,
    } as any)

    await expect(useCase.execute({ userId: 'user-3', apartmentId: 101 }))
      .rejects.toThrow('User already completed onboarding.')
  })
})
