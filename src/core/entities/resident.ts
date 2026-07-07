export interface Resident {
  id: string;
  fullName: string;
  email: string;
  /**
   * Optional — null for users authenticated exclusively via OAuth (e.g., Google).
   * Never use this field directly without a null-check.
   */
  passwordHash: string | null;
  /**
   * Optional — null until the user completes the Onboarding step.
   * Users with null apartmentId are blocked from private routes by the middleware.
   */
  apartmentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
