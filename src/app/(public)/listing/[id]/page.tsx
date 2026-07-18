import { notFound } from 'next/navigation'
import {
  getListingDetailsUseCase,
  getListingReviewsUseCase
} from '@/core/use-cases/get-listing-details'
import { ListingCard } from '@/components/catalog/ListingCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewList } from '@/components/reviews/ReviewList'
import { auth } from '@/infrastructure/auth/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import type { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingDetailsUseCase(id)

  if (!listing) {
    return {
      title: 'Serviço não encontrado | Vizin'
    }
  }

  const title = `${listing.title} | Vizin`
  const description = listing.description.slice(0, 150) + (listing.description.length > 150 ? '...' : '')
  const ogImage = listing.portfolioImageUrl || 'https://vizin-green.vercel.app/icon.jpg'

  return {
    title,
    description,
    openGraph: {
      title: listing.title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: listing.title
        }
      ]
    }
  }
}

export default async function ListingDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListingDetailsUseCase(id)

  if (!listing) {
    notFound()
  }

  const session = await auth()

  // For US1, fetch the existing review for the logged in user
  const allReviews = await getListingReviewsUseCase(id)
  const userId = session?.user?.id
  const userReview = userId
    ? allReviews.find(r => r.authorId === userId)
    : undefined

  const isProvider = userId === listing.providerId

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          Detalhes do Serviço
        </h1>
        <Link href="/">
          <Button variant="outline">Voltar ao Catálogo</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-[400px]">
          <ListingCard listing={listing} priority />
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Deixe sua avaliação
            </h2>

            {!session?.user?.id ? (
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Você precisa estar logado para avaliar este serviço.
                </p>
                <Link href="/login">
                  <Button className="brand-gradient text-white">
                    Fazer Login
                  </Button>
                </Link>
              </div>
            ) : isProvider ? (
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  Você é o provedor deste serviço e não pode avaliá-lo.
                </p>
              </div>
            ) : (
              <ReviewForm
                serviceListingId={listing.id}
                existingReview={userReview}
              />
            )}
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Avaliações
              </h2>
              {listing.ratingAverage !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-yellow-400"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-bold text-sm text-foreground">
                    {listing.ratingAverage}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    ({listing.reviewCount})
                  </span>
                </div>
              )}
            </div>

            <ReviewList reviews={allReviews} />
          </div>
        </div>
      </div>
    </div>
  )
}
