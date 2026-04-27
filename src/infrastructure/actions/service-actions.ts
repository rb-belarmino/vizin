'use server'

import prisma from '@/infrastructure/db/client'
import { auth } from '@/infrastructure/auth/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

// Zod Schema para validação estrita dos dados do Serviço
const createServiceSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres').trim(),
  description: z
    .string()
    .min(10, 'A descrição deve ter no mínimo 10 caracteres')
    .trim(),
  priceInfo: z.string().trim().optional().nullable(),
  isPublic: z.boolean().default(true),
  whatsapp: z.string().trim().optional().nullable(),
  instagram: z.string().trim().optional().nullable(),
  facebook: z.string().trim().optional().nullable(),
  website: z.string().trim().optional().nullable(),
  serviceType: z.string().min(1, 'O tipo de serviço é obrigatório'),
  category: z.enum(
    ['Gastronomia', 'Reformas', 'Aulas', 'Beleza', 'Saúde', 'Outros'],
    {
      message: 'Selecione uma categoria válida'
    }
  ),
  imageUrl: z
    .string()
    .url('A URL da imagem deve ser válida')
    .trim()
    .optional()
    .nullable()
    .or(z.literal(''))
})

export async function createServiceAction(
  data: any
): Promise<{ success: boolean; message: string }> {
  try {
    console.log('[DEBUG createService] Dados recebidos na Action:', data)

    // 1. Segurança: Busca o id do usuário direto na sessão autenticada (inviolável pelo client)
    const session = await auth()
    console.log(
      '[DEBUG createService] Objeto session retornado pelo auth():',
      session
    )

    if (!session?.user?.id) {
      return {
        success: false,
        message:
          'Acesso negado. Você precisa estar logado para publicar um serviço.'
      }
    }

    // 2. Validação: Verifica se todos os campos vieram conforme esperado e limpa espaços extras
    const parsedData = createServiceSchema.safeParse(data)

    if (!parsedData.success) {
      console.error(
        '[DEBUG createService] Zod Validation Error:',
        parsedData.error.issues
      )
      return { success: false, message: parsedData.error.issues[0].message }
    }

    const validatedData = parsedData.data

    // 3. Persistência: Cria o serviço atrelando forçadamente ao ID do usuário da sessão
    await prisma.service.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    })

    // 4. Invalidação de Cache: Atualiza a Home Pública e o Dashboard do usuário instantaneamente
    revalidatePath('/')
    revalidatePath('/dashboard')

    return { success: true, message: 'Serviço publicado com sucesso!' }
  } catch (error) {
    console.error(
      '[DEBUG createService] ERRO GRAVE NO BANCO DE DADOS ao criar serviço:'
    )
    console.error(error) // Imprime a stack completa do Prisma para depuração do banco
    return {
      success: false,
      message: 'Ocorreu um erro interno ao criar o serviço.'
    }
  }
}

/**
 * Função utilitária para deletar uma imagem do UploadThing baseada na URL
 */
async function deleteImageFromUT(url: string | null | undefined) {
  if (!url || !url.includes('/f/')) return

  try {
    const fileKey = url.split('/f/')[1]
    if (fileKey) {
      await utapi.deleteFiles(fileKey)
      console.log(`[UT DEBUG] Arquivo deletado do storage: ${fileKey}`)
    }
  } catch (error) {
    console.error('[UT DEBUG] Erro ao deletar arquivo do UploadThing:', error)
  }
}

/**
 * Action para Deletar um Serviço e sua imagem associada
 */
export async function deleteServiceAction(
  serviceId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, message: 'Não autorizado' }
    }

    // 1. Busca o serviço para verificar o dono e pegar a URL da imagem
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service || service.userId !== session.user.id) {
      return { success: false, message: 'Serviço não encontrado ou negado' }
    }

    // 2. Deleta a imagem do UploadThing se existir
    if (service.imageUrl) {
      await deleteImageFromUT(service.imageUrl)
    }

    // 3. Deleta do Banco de Dados
    await prisma.service.delete({
      where: { id: serviceId }
    })

    revalidatePath('/')
    revalidatePath('/dashboard')

    return { success: true, message: 'Serviço removido com sucesso!' }
  } catch (error) {
    console.error('Erro ao deletar serviço:', error)
    return { success: false, message: 'Erro ao processar a exclusão' }
  }
}

/**
 * Action para Atualizar um Serviço existente
 */
export async function updateServiceAction(
  serviceId: string,
  data: any
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, message: 'Não autorizado' }
    }

    // Validação com o mesmo schema de criação (ou um similar parcial)
    const parsedData = createServiceSchema.safeParse(data)
    if (!parsedData.success) {
      return { success: false, message: parsedData.error.issues[0].message }
    }

    // 1. Busca o serviço atual
    const currentService = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!currentService || currentService.userId !== session.user.id) {
      return { success: false, message: 'Serviço não encontrado' }
    }

    // 2. SE o usuário enviou uma nova imagem e ela é diferente da atual, limpa a antiga
    if (
      parsedData.data.imageUrl &&
      parsedData.data.imageUrl !== currentService.imageUrl
    ) {
      await deleteImageFromUT(currentService.imageUrl)
    }

    // 3. Atualiza no Banco
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...parsedData.data
      }
    })

    revalidatePath('/')
    revalidatePath('/dashboard')

    return { success: true, message: 'Serviço atualizado com sucesso!' }
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error)
    return { success: false, message: 'Erro ao processar a atualização' }
  }
}
