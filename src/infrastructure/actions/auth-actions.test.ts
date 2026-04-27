import { describe, it, expect } from 'vitest'
import { registerUserAction } from './auth-actions'

// Note: O prismaMock já é configurado globalmente via vitest.config.ts se necessário,
// mas aqui importamos para garantir que o mock está ativo.
import '@/infrastructure/db/__mocks__/client'

describe('registerUserAction (TDD - Phase RED)', () => {
  it('deve retornar erro de validação quando o e-mail for inválido', async () => {
    const dataComEmailInvalido = {
      email: 'rodrigo.com', // Falta o @
      password: 'senha123',
      fullName: 'Rodrigo Teste',
      unitNumber: '101'
    }

    const result = await registerUserAction(dataComEmailInvalido)

    // O teste deve passar se a Action retornar success: false e a mensagem correta do Zod
    expect(result.success).toBe(false)
    expect(result.message).toBe('E-mail inválido')
  })

  it('deve retornar erro quando a senha for muito curta', async () => {
    const dataComSenhaCurta = {
      email: 'teste@vizin.com',
      password: '123', // Mínimo é 6
      fullName: 'Rodrigo Teste',
      unitNumber: '101'
    }

    const result = await registerUserAction(dataComSenhaCurta)

    expect(result.success).toBe(false)
    expect(result.message).toBe('A senha deve ter no mínimo 6 caracteres')
  })
})
