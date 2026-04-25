"use server";

import prisma from "@/infrastructure/db/client";
import bcrypt from "bcryptjs";

interface RegisterUserData {
  email: string;
  password?: string;
  fullName?: string;
  unitBlock?: string;
  unitNumber?: string;
}

export async function registerUserAction(data: RegisterUserData): Promise<{ success: boolean; message: string }> {
  try {
    const { email, password, fullName, unitBlock, unitNumber } = data;

    if (!email || !password) {
      return { success: false, message: "E-mail e senha são obrigatórios." };
    }

    // Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Este e-mail já está cadastrado." };
    }

    // Faz o hash da senha usando bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Salva o novo usuário no banco
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName || null,
        unitBlock: unitBlock || null,
        unitNumber: unitNumber || null,
      },
    });

    return { success: true, message: "Morador cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro no cadastro (registerUserAction):", error);
    return { success: false, message: "Ocorreu um erro interno ao processar o cadastro." };
  }
}
