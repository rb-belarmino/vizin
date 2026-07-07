import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Nome completo deve ter pelo menos 3 caracteres"),
  apartmentId: z.coerce.number().min(1, "Número do apartamento é obrigatório")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "O token é obrigatório"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres")
});

export const setPasswordSchema = z.object({
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres")
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
