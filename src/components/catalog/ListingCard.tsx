'use client'

import Image from 'next/image'
import { Listing } from '@/core/entities/listing'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORY_EMOJI: Record<string, string> = {
  Tecnologia: '💻',
  Limpeza: '🧹',
  Pets: '🐾',
  Eventos: '🎉',
  Gastronomia: '🍽️',
  Reformas: '🔨',
  Aulas: '📚',
  Beleza: '💇',
  Saúde: '🏥',
  Outros: '⭐'
}

const CATEGORY_COLORS: Record<string, string> = {
  Tecnologia: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  Limpeza: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
  Pets: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  Eventos: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
  Gastronomia: 'bg-orange-100 text-orange-700 border-orange-200',
  Reformas: 'bg-stone-100 text-stone-700 border-stone-200',
  Aulas: 'bg-blue-100 text-blue-700 border-blue-200',
  Beleza: 'bg-pink-100 text-pink-700 border-pink-200',
  Saúde: 'bg-green-100 text-green-700 border-green-200',
  Outros: 'bg-yellow-100 text-yellow-700 border-yellow-200'
}

async function handleShare(listing: Listing) {
  const url =
    window.location.origin + `/?q=${encodeURIComponent(listing.title)}`
  const shareData = {
    title: listing.title,
    text: `Confira: ${listing.title}${listing.priceBaseline ? ` — ${listing.priceBaseline}` : ''}`,
    url
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch {
      // user cancelled
    }
  } else {
    await navigator.clipboard.writeText(url)
    alert('Link copiado para a área de transferência!')
  }
}

export function ListingCard({
  listing,
  priority = false
}: {
  listing: Listing
  priority?: boolean
}) {
  const [imgError, setImgError] = useState(false)
  const emoji = CATEGORY_EMOJI[listing.categoryId] ?? '⭐'
  const badgeColor =
    CATEGORY_COLORS[listing.categoryId] ??
    'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <Card className="relative overflow-hidden flex flex-col h-full group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <Link
        href={`/listing/${listing.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalhes de ${listing.title}`}
      />

      {/* Image */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {listing.portfolioImageUrl && !imgError ? (
          <Image
            src={listing.portfolioImageUrl}
            alt={listing.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full brand-gradient gap-2">
            <span
              className="text-4xl"
              role="img"
              aria-label={listing.categoryId}
            >
              {emoji}
            </span>
            <span className="text-white/70 text-xs font-medium">
              {listing.categoryId}
            </span>
          </div>
        )}
        {/* Share button overlay */}
        <button
          onClick={e => {
            e.preventDefault()
            handleShare(listing)
          }}
          id={`share-btn-${listing.id}`}
          aria-label="Compartilhar serviço"
          title="Compartilhar"
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      </div>

      {/* Header */}
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight line-clamp-2 flex-1">
            {listing.title}
          </CardTitle>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${badgeColor}`}
          >
            {emoji} {listing.categoryId}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          {listing.priceBaseline && (
            <p className="text-sm font-bold text-primary">
              {listing.priceBaseline}
            </p>
          )}
          {listing.reviewCount !== undefined && listing.reviewCount > 0 ? (
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-yellow-400"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-foreground">{listing.ratingAverage}</span>
              <span className="text-xs">({listing.reviewCount})</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground font-medium">
              Novo
            </div>
          )}
        </div>
      </CardHeader>

      {/* Description */}
      <CardContent className="grow pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {listing.description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="relative z-20 flex flex-col gap-3 border-t bg-muted/30 p-4 pt-3">
        {/* Provider info */}
        {(listing.providerName || listing.providerApartmentId) && (
          <div className="flex items-center gap-2 w-full">
            <div className="w-5 h-5 rounded-full brand-gradient flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-bold">
                {listing.providerName?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate">
              {listing.providerName}
              {listing.providerApartmentId && listing.showApartment && (
                <span className="text-muted-foreground/60 ml-1">
                  · Apto {listing.providerApartmentId}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Contact links */}
        <div className="flex gap-2 w-full">
          {listing.whatsappNumber && (
            <a
              href={`https://wa.me/${listing.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              id={`whatsapp-link-${listing.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-semibold transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          )}
          {listing.instagramHandle && (
            <a
              href={`https://instagram.com/${listing.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              id={`instagram-link-${listing.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 text-xs font-semibold transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              @{listing.instagramHandle}
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
