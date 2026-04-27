import { describe, it, expect, vi, beforeEach } from 'vitest'
vi.mock('uploadthing/server', () => {
  return {
    UTApi: vi.fn().mockImplementation(() => {
      return {
        deleteFiles: vi.fn().mockResolvedValue({ success: true })
      }
    })
  }
})
import { createServiceAction } from './service-actions'
import prisma from '@/infrastructure/db/client'
import { auth } from '@/infrastructure/auth/auth'
import { revalidatePath } from 'next/cache'

// 1. Mockamos as dependências externas

vi.mock('@/infrastructure/db/client', () => ({
  default: {
    service: {
      create: vi.fn()
    }
  }
}))

vi.mock('@/infrastructure/auth/auth', () => ({
  auth: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('createServiceAction', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Limpa os mocks antes de cada teste
  })

  // CENÁRIO 1: Usuário não logado (RED)
  it('deve retornar erro se o usuário não estiver autenticado', async () => {
    // Simulamos que o auth() retornou null
    ;(auth as any).mockResolvedValue(null)

    const mockData = { title: 'Serviço Teste', description: 'Desc' }
    const result = await createServiceAction(mockData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Não autorizado')
  })

  // CENÁRIO 2: Dados inválidos (Zod)
  it('deve falhar se os dados enviados forem inválidos (ex: sem título)', async () => {
    ;(auth as any).mockResolvedValue({ user: { id: 'user-123' } })

    const incompleteData = { description: 'Falta o título' }
    const result = await createServiceAction(incompleteData as any)

    expect(result.success).toBe(false)
    // Aqui testamos se a validação do Zod barrou
    expect(result.message).toBeDefined()
  })

  // CENÁRIO 3: Sucesso (GREEN)
  it('deve criar um serviço com sucesso quando os dados e a sessão estão ok', async () => {
    const userId = 'user-123'
    ;(auth as any).mockResolvedValue({ user: { id: userId } })

    const validData = {
      title: 'Bolo de Cenoura',
      description: 'Melhor do prédio',
      serviceType: 'at_apartment',
      isPublic: true,
      category: 'Gastronomia'
    }

    // Simulamos que o Prisma salvou com sucesso
    ;(prisma.service.create as any).mockResolvedValue({
      id: 'service-999',
      ...validData
    })

    const result = await createServiceAction(validData)

    expect(result.success).toBe(true)
    expect(prisma.service.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: validData.title,
        userId: userId // Garante que o ID veio da sessão
      })
    })
    // Garante que a Vitrine foi atualizada
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
