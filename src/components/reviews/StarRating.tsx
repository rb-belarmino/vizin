'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readOnly?: boolean
  className?: string
}

export function StarRating({ rating, onRatingChange, readOnly = false, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className={cn("flex items-center space-x-1", className)} onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star

        return (
          <button
            key={star}
            type="button"
            className={cn(
              "focus:outline-none transition-colors duration-200",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
              isFilled ? "text-yellow-400" : "text-muted"
            )}
            onClick={() => {
              if (!readOnly && onRatingChange) {
                onRatingChange(star)
              }
            }}
            onMouseEnter={() => {
              if (!readOnly) {
                setHoverRating(star)
              }
            }}
            disabled={readOnly}
          >
            <Star className="w-6 h-6" fill={isFilled ? "currentColor" : "none"} />
          </button>
        )
      })}
    </div>
  )
}
