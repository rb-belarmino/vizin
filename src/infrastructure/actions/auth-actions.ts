"use server";

import prisma from "@/infrastructure/db/client";
import bcrypt from "bcryptjs";

import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("E-mail inválido").trim(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  fullName: z.string().trim().optional(),
  unitBlock: z.string().optional().default("Torre Única"),
  unitNumber: z.string()
    .trim()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "O número do apartamento deve conter apenas números",
    })
    .optional(),
});

type RegisterUserData = z.infer<typeof registerSchema>;

export async function registerUserAction(data: any): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Valida os dados usando o Zod
    const parsedData = registerSchema.safeParse(data);

    if (!parsedData.success) {
      // Retorna a primeira mensagem de erro do Zod
      console.error(`Zod Validation Error para o e-mail: ${data?.email}`);
      return { success: false, message: parsedData.error.issues[0].message };
    }

    const { email, password, fullName, unitBlock, unitNumber } = parsedData.data;

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
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName || null,
        unitBlock: unitBlock || "Torre Única", // Garante 'Torre Única' como fallback adicional
        unitNumber: unitNumber || null,
      },
    });

    // Retorna os dados em texto plano para o Frontend realizar o signIn() do lado do cliente
    return { 
      success: true, 
      message: "Morador cadastrado com sucesso!",
      data: { 
        email, 
        password 
      }
    };
  } catch (error) {
    console.error(`ERRO NO BANCO DE DADOS ao cadastrar o e-mail: ${data?.email}`);
    if (error instanceof Error) {
      console.error(error.message); 
    }
    return { success: false, message: "Ocorreu um erro interno ao processar o cadastro." };
  }
}
