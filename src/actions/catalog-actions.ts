'use server'

import {
  GetPublicListingsParams,
  getPublicListingsSchema
} from './schemas/catalog-schema'
import { GetPublicListings } from '../core/use-cases/get-public-listings'
import { PrismaListingRepository } from '../infrastructure/database/listing-repository'

export async function fetchPublicListings(params: GetPublicListingsParams) {
  // Validate input
  const validatedParams = getPublicListingsSchema.parse(params)

  // Instantiate use-case with its dependencies
  const repository = new PrismaListingRepository()
  const useCase = new GetPublicListings(repository)

  // Execute use-case
  const listings = await useCase.execute(validatedParams)

  // Return raw data
  return listings
}
