import { ResidentRepository } from '@/infrastructure/database/resident-repository'
import { sendEmail } from '@/infrastructure/email/mailer'
import ResetPasswordEmail from '@/infrastructure/email/templates/reset-password'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import * as React from 'react'

export async function generateResetToken(email: string) {
  const repository = new ResidentRepository()
  const user = await repository.findResidentByEmail(email)

  // FR-016b: Throw explicit error for UX
  if (!user) {
    throw new Error('Email not found')
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 3600000) // 1 hour from now
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

  await repository.createPasswordResetToken({
    email,
    token,
    expires
  })

  const emailResult = await sendEmail({
    to: email,
    subject: 'Redefinição de Senha - Vizin',
    react: React.createElement(ResetPasswordEmail, {
      resetLink,
      userName: user.fullName
    })
  })

  if (emailResult.error) {
    console.error('Falha ao enviar email de reset:', emailResult.error)
    throw new Error(
      'Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.'
    )
  }

  return true
}

export async function validateResetToken(token: string, newPassword: string) {
  const repository = new ResidentRepository()
  const resetToken = await repository.findPasswordResetToken(token)

  if (!resetToken) {
    throw new Error('Token inválido ou expirado.')
  }

  if (resetToken.expires < new Date()) {
    await repository.deletePasswordResetToken(resetToken.id)
    throw new Error('Token expirado. Por favor, solicite um novo.')
  }

  const user = await repository.findResidentByEmail(resetToken.email)

  if (!user) {
    throw new Error('Usuário não encontrado.')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Use transaction to ensure both operations succeed
  await repository.resetPasswordWithTransaction(
    user.id,
    user.email,
    hashedPassword
  )

  return true
}
