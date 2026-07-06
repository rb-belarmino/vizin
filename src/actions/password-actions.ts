'use server'

import { auth } from '@/infrastructure/auth/auth'
import { changePassword } from '@/core/use-cases/change-password'
import {
  generateResetToken,
  validateResetToken
} from '@/core/use-cases/reset-password'
import {
  changePasswordSchema,
  ChangePasswordInput,
  forgotPasswordSchema,
  ForgotPasswordInput,
  resetPasswordSchema,
  ResetPasswordInput
} from './schemas/profile-schema'

export async function changePasswordAction(data: ChangePasswordInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: 'Não autorizado. Faça login.' }
    }

    const parsed = changePasswordSchema.safeParse(data)
    if (!parsed.success) {
      return { error: 'Dados inválidos.' }
    }

    await changePassword(
      session.user.id,
      parsed.data.currentPassword,
      parsed.data.newPassword
    )

    return { success: 'Senha atualizada com sucesso!' }
  } catch (error: any) {
    // If the error message is about incorrect password, return it directly
    if (error.message === 'A senha atual está incorreta.') {
      return { error: error.message }
    }
    return { error: 'Erro interno ao alterar senha.' }
  }
}

export async function forgotPasswordAction(data: ForgotPasswordInput) {
  try {
    const parsed = forgotPasswordSchema.safeParse(data)
    if (!parsed.success) {
      return { error: 'E-mail inválido.' }
    }

    await generateResetToken(parsed.data.email)

    return { success: 'Um link de recuperação foi enviado para o seu e-mail.' }
  } catch (error: any) {
    // FR-016b: Explicit error for email not found
    if (error.message === 'Email not found') {
      return { error: 'Este e-mail não está cadastrado no sistema.' }
    }
    return {
      error: 'Erro ao solicitar redefinição. Tente novamente mais tarde.'
    }
  }
}

export async function resetPasswordAction(data: ResetPasswordInput) {
  try {
    const parsed = resetPasswordSchema.safeParse(data)
    if (!parsed.success) {
      return { error: 'Dados inválidos. Verifique a senha e o token.' }
    }

    await validateResetToken(parsed.data.token, parsed.data.newPassword)

    return {
      success: 'Sua senha foi redefinida com sucesso! Você já pode fazer login.'
    }
  } catch (error: any) {
    return {
      error:
        error.message ||
        'Erro ao redefinir a senha. O token pode estar expirado.'
    }
  }
}
