'use server'

import { ListingSchema, ListingSchemaType } from './schemas/listing-schema'
import { ResidentRepository } from '../infrastructure/database/resident-repository'
import { auth } from '../infrastructure/auth/auth'
import { revalidatePath } from 'next/cache'

import { ManageListingsUseCase } from '../core/use-cases/manage-listings'
import { UploadStorageUseCase } from '../core/use-cases/upload-storage'

export async function createListingAction(data: ListingSchemaType) {
  const repository = new ResidentRepository()
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Não autorizado.' }
  }

  const parsed = ListingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Dados inválidos.', details: parsed.error.flatten() }
  }

  try {
    const useCase = new ManageListingsUseCase(repository)
    await useCase.createListing({
      ...parsed.data,
      providerId: session.user.id
    })

    revalidatePath('/dashboard')
    revalidatePath('/')

    return { success: 'Serviço publicado com sucesso!' }
  } catch (error) {
    console.error('Failed to create listing:', error)
    return { error: 'Falha ao criar o serviço. Tente novamente.' }
  }
}

export async function updateListingAction(id: string, data: ListingSchemaType) {
  const repository = new ResidentRepository()
  const storage = new UploadStorageUseCase()
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Não autorizado.' }
  }

  const parsed = ListingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Dados inválidos.', details: parsed.error.flatten() }
  }

  try {
    // Ownership check
    const existing = await repository.getListingById(id)
    if (!existing || existing.providerId !== session.user.id) {
      return { error: 'Serviço não encontrado ou acesso negado.' }
    }

    const useCase = new ManageListingsUseCase(repository, storage)
    await useCase.updateListing(id, {
      title: parsed.data.title,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      portfolioImageUrl: parsed.data.portfolioImageUrl,
      portfolioImageKey: parsed.data.portfolioImageKey,
      priceBaseline: parsed.data.priceBaseline,
      whatsappNumber: parsed.data.whatsappNumber,
      instagramHandle: parsed.data.instagramHandle,
      visibilityStatus: parsed.data.visibilityStatus
    })

    revalidatePath('/dashboard')
    revalidatePath('/')

    return { success: 'Serviço atualizado com sucesso!' }
  } catch (error) {
    console.error('Failed to update listing:', error)
    return { error: 'Falha ao atualizar o serviço. Tente novamente.' }
  }
}

export async function toggleVisibilityAction(id: string) {
  const repository = new ResidentRepository()
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Não autorizado.' }
  }

  try {
    const existing = await repository.getListingById(id)
    if (!existing || existing.providerId !== session.user.id) {
      return { error: 'Serviço não encontrado ou acesso negado.' }
    }

    const newStatus =
      existing.visibilityStatus === 'Public' ? 'Hidden' : 'Public'
    const useCase = new ManageListingsUseCase(repository)
    await useCase.updateListing(id, { visibilityStatus: newStatus })

    revalidatePath('/dashboard')
    revalidatePath('/')

    return {
      success: `Serviço agora está ${newStatus === 'Public' ? 'público' : 'oculto'}.`,
      newStatus
    }
  } catch (error) {
    console.error('Failed to toggle visibility:', error)
    return { error: 'Falha ao alterar visibilidade.' }
  }
}

export async function deleteListingAction(id: string) {
  const repository = new ResidentRepository()
  const storage = new UploadStorageUseCase()
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Não autorizado.' }
  }

  try {
    // Ownership check
    const existing = await repository.getListingById(id)
    if (!existing || existing.providerId !== session.user.id) {
      return { error: 'Serviço não encontrado ou acesso negado.' }
    }

    const useCase = new ManageListingsUseCase(repository, storage)
    await useCase.deleteListing(id)

    revalidatePath('/dashboard')
    revalidatePath('/')

    return { success: 'Serviço excluído com sucesso!' }
  } catch (error) {
    console.error('Failed to delete listing:', error)
    return { error: 'Falha ao excluir o serviço.' }
  }
}
