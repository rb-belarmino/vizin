'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function createService(formData: FormData) {
  try {
    // 1. Verify if the user is truly authenticated
    const session = await getServerSession(authOptions)

    // Console log de debug! Veja o que imprime no terminal quando clica no botão:
    console.log('SESSION NA ACTION:', session)

    if (!session || !session.user) {
      return { error: 'Não autorizado. Você precisa estar logado.' }
    }

    // 2. Extração segura com fallback
    const userId = (session.user as any).id

    if (!userId) {
      console.log('ERRO: O Token ta vindo sem ID do DB!')
      return { error: 'Erro de autenticação interno. Refaça o login.' }
    }

    // 3. Extract the form data submitted by the user
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const contact = formData.get('contact') as string

    // 4. Basic Validation
    if (!title || !description || !category) {
      return { error: 'Título, descrição e categoria são campos obrigatórios.' }
    }

    if (description.length < 10) {
      return {
        error:
          'A descrição precisa ter pelo menos 10 caracteres para ajudar seus vizinhos a entenderem melhor.'
      }
    }

    // 5. Create the Service in the Database, bound to the authenticated User
    await prisma.service.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        contact: contact ? contact.trim() : null,
        providerId: userId // The foreign key associating the service to the resident
      }
    })

    return { success: true }
  } catch (error) {
    // --- ADICIONE ESTA LINHA PARA VERMOS O ERRO REAL ---
    console.error('ERRO FATAL NO PRISMA AO CRIAR SERVICO:', error)

    return { error: 'Ocorreu um erro interno ao salvar o serviço.' }
  }
}
