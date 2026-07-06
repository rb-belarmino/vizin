'use server'

import { auth } from '@/infrastructure/auth/auth'
import { updateProfile } from '@/core/use-cases/update-profile'
import {
  updateProfileSchema,
  UpdateProfileInput
} from './schemas/profile-schema'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(data: UpdateProfileInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: 'Não autorizado. Faça login.' }
    }

    const parsedData = updateProfileSchema.safeParse(data)
    if (!parsedData.success) {
      return { error: 'Dados inválidos. Verifique os campos.' }
    }

    await updateProfile(session.user.id, parsedData.data)

    // FR-014: Atualização no perfil precisa refletir nos listings.
    // Usamos revalidatePath para forçar o Next.js a puxar os novos dados da cache
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')

    return { success: 'Perfil atualizado com sucesso!' }
  } catch (error: any) {
    console.error('Update Profile Error:', error)
    return { error: 'Erro ao atualizar o perfil. Tente novamente mais tarde.' }
  }
}
