"use server";

import prisma from "@/infrastructure/db/client";
import { auth } from "@/infrastructure/auth/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema para validação estrita dos dados do Serviço
const createServiceSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres").trim(),
  description: z.string().min(10, "A descrição deve ter no mínimo 10 caracteres").trim(),
  priceInfo: z.string().trim().optional().nullable(),
  isPublic: z.boolean().default(true),
  whatsapp: z.string().trim().optional().nullable(),
  instagram: z.string().trim().optional().nullable(),
  facebook: z.string().trim().optional().nullable(),
  website: z.string().trim().optional().nullable(),
  serviceType: z.string().min(1, "O tipo de serviço é obrigatório"),
});

export async function createServiceAction(data: any): Promise<{ success: boolean; message: string }> {
  try {
    console.log("[DEBUG createService] Dados recebidos na Action:", data);

    // 1. Segurança: Busca o id do usuário direto na sessão autenticada (inviolável pelo client)
    const session = await auth();
    console.log("[DEBUG createService] Objeto session retornado pelo auth():", session);

    if (!session?.user?.id) {
      return { success: false, message: "Acesso negado. Você precisa estar logado para publicar um serviço." };
    }

    // 2. Validação: Verifica se todos os campos vieram conforme esperado e limpa espaços extras
    const parsedData = createServiceSchema.safeParse(data);

    if (!parsedData.success) {
      console.error("[DEBUG createService] Zod Validation Error:", parsedData.error.issues);
      return { success: false, message: parsedData.error.issues[0].message };
    }

    const validatedData = parsedData.data;

    // 3. Persistência: Cria o serviço atrelando forçadamente ao ID do usuário da sessão
    await prisma.service.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    // 4. Invalidação de Cache: Atualiza a Home Pública e o Dashboard do usuário instantaneamente
    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Serviço publicado com sucesso!" };
  } catch (error) {
    console.error("[DEBUG createService] ERRO GRAVE NO BANCO DE DADOS ao criar serviço:");
    console.error(error); // Imprime a stack completa do Prisma para depuração do banco
    return { success: false, message: "Ocorreu um erro interno ao criar o serviço." };
  }
}
