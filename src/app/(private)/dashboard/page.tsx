import { auth } from '@/infrastructure/auth/auth'
import { ResidentRepository } from '@/infrastructure/database/resident-repository'
import { ListingCard } from '@/components/catalog/ListingCard'
import Link from 'next/link'
import { DashboardListingActions } from '@/components/dashboard/DashboardListingActions'
import {
  deleteListingAction,
  toggleVisibilityAction
} from '@/actions/listing-actions'
import { Listing } from '@/core/entities/listing'

export const metadata = {
  title: 'Meus Serviços | Vizin'
}

async function ToggleVisibilityButton({
  listingId,
  status
}: {
  listingId: string
  status: string
}) {
  const isPublic = status === 'Public'
  return (
    <form
      action={async () => {
        'use server'
        await toggleVisibilityAction(listingId)
      }}
    >
      <button
        type="submit"
        id={`toggle-visibility-${listingId}`}
        className={`mt-1 w-full rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
          isPublic
            ? 'border-green-200 text-green-700 hover:bg-green-50'
            : 'border-amber-200 text-amber-700 hover:bg-amber-50'
        }`}
      >
        {isPublic ? '✓ Público' : '○ Oculto — tornar público'}
      </button>
    </form>
  )
}

async function DeleteButton({ listingId }: { listingId: string }) {
  return (
    <form
      action={async () => {
        'use server'
        await deleteListingAction(listingId)
      }}
    >
      <button
        type="submit"
        id={`delete-listing-${listingId}`}
        className="mt-1 w-full rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        Excluir
      </button>
    </form>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  const providerId = session!.user!.id as string

  const repository = new ResidentRepository()
  const rawListings = await repository.getResidentListings(providerId)

  // Map to Listing entity shape (include provider info)
  const listings: Listing[] = rawListings.map(l => ({
    id: l.id,
    title: l.title,
    description: l.description,
    categoryId: l.categoryId,
    portfolioImageUrl: l.portfolioImageUrl,
    portfolioImageKey: l.portfolioImageKey,
    priceBaseline: l.priceBaseline,
    whatsappNumber: l.whatsappNumber,
    instagramHandle: l.instagramHandle,
    visibilityStatus: l.visibilityStatus,
    showApartment: l.showApartment,
    providerId: l.providerId,
    providerName: l.provider?.fullName,
    providerApartmentId: l.provider?.apartmentId,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt
  }))

  const publicCount = listings.filter(
    l => l.visibilityStatus === 'Public'
  ).length

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Meus Serviços Cadastrados</h1>
        <Link
          href="/dashboard/novo"
          className="brand-gradient text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Serviço
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {listings.length === 0
            ? 'Você ainda não tem serviços publicados'
            : `${listings.length} serviço${listings.length > 1 ? 's' : ''} · ${publicCount} público${publicCount !== 1 ? 's' : ''}`}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Listings grid */}
      <section>
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 py-20 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center opacity-40">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold">Nenhum serviço ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Clique no botão "Novo Serviço" acima para publicar.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map(listing => (
              <div
                key={listing.id}
                className="flex flex-col gap-1 animate-slide-up"
              >
                <div className="flex-1">
                  <ListingCard listing={listing} />
                </div>
                {/* Edit button (client — opens modal) */}
                <DashboardListingActions listing={listing} />
                <ToggleVisibilityButton
                  listingId={listing.id}
                  status={listing.visibilityStatus}
                />
                <DeleteButton listingId={listing.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
