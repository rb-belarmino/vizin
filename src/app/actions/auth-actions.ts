'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Note: Ensure the function returns typed results for proper error handling
export async function registerUser(formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const block = formData.get('block') as string
    const number = formData.get('number') as string

    // 1. Basic validation required for safety
    if (!fullName || !email || !password || !block || !number) {
      return { error: 'Todos os campos são obrigatórios.' }
    }

    if (password.length < 6) {
      return { error: 'A senha deve ter no mínimo 6 caracteres.' }
    }

    // 2. Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: 'Este e-mail já está em uso.' }
    }

    // 3. Hash the submitted password (very important!)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Find the Unit or Create it if it's the first resident of this block/number
    // upsert ensures we don't accidentally create duplicates due to race conditions
    const unit = await prisma.unit.upsert({
      where: {
        block_number: {
          block: block.toUpperCase().trim(),
          number: number.trim()
        }
      },
      update: {}, // Do nothing if it already exists
      create: {
        block: block.toUpperCase().trim(),
        number: number.trim()
      }
    })

    // 5. Create the new User and associate it with the found/created Unit
    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        unitId: unit.id
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Erro no cadastro:', error)
    return { error: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' }
  }
}
