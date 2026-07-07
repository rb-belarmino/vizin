import { ResidentRepository } from '../../infrastructure/database/resident-repository';

type CompleteOnboardingParams = {
  userId: string;
  apartmentId: number;
};

export class CompleteOnboardingUseCase {
  constructor(private readonly residentRepository: ResidentRepository) {}

  async execute({ userId, apartmentId }: CompleteOnboardingParams) {
    const user = await this.residentRepository.findResidentById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (user.apartmentId !== null && user.apartmentId !== undefined) {
      throw new Error('User already completed onboarding.');
    }

    return await this.residentRepository.updateResident(userId, { apartmentId });
  }
}
