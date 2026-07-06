import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/infrastructure/email/mailer';
import ResetPasswordEmail from '@/infrastructure/email/templates/reset-password';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function generateResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // FR-016b: Throw explicit error for UX
  if (!user) {
    throw new Error('Email not found');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`; // Use env var for base URL in prod

  // FOR LOCAL TESTING: log the link to the server console
  console.log('--- RECOVERY LINK ---');
  console.log(resetLink);
  console.log('---------------------');

  await sendEmail({
    to: email,
    subject: 'Redefinição de Senha - Vizin',
    react: ResetPasswordEmail({ resetLink, userName: user.fullName }),
  });

  return true;
}

export async function validateResetToken(token: string, newPassword: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error('Token inválido ou expirado.');
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    throw new Error('Token expirado. Por favor, solicite um novo.');
  }

  const user = await prisma.user.findUnique({
    where: { email: resetToken.email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Use transaction to ensure both operations succeed
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { email: user.email }, // Delete all tokens for this user
    }),
  ]);

  return true;
}
