export interface Resident {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  apartmentId: number;
  createdAt: Date;
  updatedAt: Date;
}
