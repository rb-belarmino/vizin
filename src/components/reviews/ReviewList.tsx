'use client'

import { Review } from '../../core/entities/review'
import { StarRating } from './StarRating'

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground bg-muted/30 rounded-xl">
        <p>Ainda não há avaliações para este serviço.</p>
        <p className="text-sm mt-1">Seja o primeiro a avaliar!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded-xl bg-card hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {review.authorName?.charAt(0).toUpperCase() ?? '?'}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {review.authorName ?? 'Vizinho'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat('pt-BR', { 
                    day: '2-digit', month: 'short', year: 'numeric' 
                  }).format(new Date(review.createdAt))}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} readOnly className="scale-90 origin-right" />
          </div>
          {review.comment && (
            <p className="text-sm text-foreground/80 mt-3 whitespace-pre-line leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
