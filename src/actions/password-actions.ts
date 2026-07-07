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
  setPasswordSchema,
  SetPasswordInput,
  forgotPasswordSchema,
  ForgotPasswordInput,
  resetPasswordSchema,
  ResetPasswordInput
} from './schemas/profile-schema'
import { setLocalPassword } from '@/core/use-cases/set-local-password'

export async function setLocalPasswordAction(data: SetPasswordInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: 'Não autorizado. Faça login.' }
    }

    const parsed = setPasswordSchema.safeParse(data)
    if (!parsed.success) {
      return { error: 'Dados inválidos.' }
    }

    await setLocalPassword(session.user.id, parsed.data.newPassword)

    return { success: 'Senha criada com sucesso! Você já pode usá-la para fazer login.' }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Erro interno ao criar senha.' }
  }
}

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
  } catch (error) {
    // If the error message is about incorrect password, return it directly
    if (
      (error instanceof Error ? error.message : String(error)) ===
      'A senha atual está incorreta.'
    ) {
      return { error: error instanceof Error ? error.message : String(error) }
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
  } catch (error) {
    // FR-016b: Explicit error for email not found
    if (
      (error instanceof Error ? error.message : String(error)) ===
      'Email not found'
    ) {
      return { error: 'Este e-mail não está cadastrado no sistema.' }
    }
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Erro ao solicitar redefinição. Tente novamente mais tarde.'
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
  } catch (error) {
    return {
      error:
        (error instanceof Error ? error.message : String(error)) ||
        'Erro ao redefinir a senha. O token pode estar expirado.'
    }
  }
}
