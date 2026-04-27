import { PrismaClient } from '@prisma/client'
import { beforeEach, vi } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'

import prisma from '../client'

// Cria um Mock Profundo do Prisma Client
vi.mock('../client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

// Exporta o mock para ser usado nos testes
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

// Reseta o estado do mock antes de cada teste
beforeEach(() => {
  mockReset(prismaMock)
})
