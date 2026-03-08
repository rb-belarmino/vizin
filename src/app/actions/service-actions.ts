'use server'

import { prisma } from '@/infrastructure/db/client' // <-- ACERTO 1: adicionei chaves aqui
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function createService(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    // <-- ACERTO 2: forçamos o TypeScript a entender que temos o id
    const userId = (session?.user as any)?.id

    if (!userId) {
      return { success: false, error: 'Usuário não autenticado.' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const contact = formData.get('contact') as string
    const websiteUrl = formData.get('websiteUrl') as string | null
    const imageUrl = formData.get('imageUrl') as string | null

    if (!title || !description || !category || !contact) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' }
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        category,
        contact,
        websiteUrl: websiteUrl || null,
        imageUrl: imageUrl || null,
        providerId: userId
      }
    })

    return { success: true, service: newService }
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    return { success: false, error: 'Erro interno ao criar o serviço.' }
  }
}
