'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, ReviewInput } from '../../actions/schemas/review.schema'
import { submitReviewAction, deleteReviewAction } from '../../actions/review-actions'
import { StarRating } from './StarRating'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface ReviewFormProps {
  serviceListingId: string
  existingReview?: {
    id: string
    rating: number
    comment: string | null
  }
}

export function ReviewForm({ serviceListingId, existingReview }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      serviceListingId,
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || ''
    }
  })

  const currentRating = useWatch({ control, name: 'rating' })
  const onSubmit = async (data: ReviewInput) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const result = await submitReviewAction(data)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(result.success || 'Avaliação salva!')
    }

    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!existingReview) return
    if (!confirm('Tem certeza que deseja excluir sua avaliação?')) return

    setIsSubmitting(true)
    setError(null)

    const result = await deleteReviewAction(existingReview.id, serviceListingId)

    if (result.error) {
      setError(result.error)
    } else {
      // Reload or state change logic can be handled by parent or revalidatePath
      setSuccess('Avaliação excluída.')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg glass p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-foreground">
        {existingReview ? 'Sua Avaliação' : 'Avaliar Serviço'}
      </h3>

      {error && <p className="text-destructive text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Nota</label>
        <StarRating
          rating={currentRating}
          onRatingChange={(rating) => {
            setValue('rating', rating, { shouldValidate: true })
          }}
        />
        {errors.rating && <p className="text-destructive text-xs">{errors.rating.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Comentário (opcional)</label>
        <Textarea
          {...register('comment')}
          placeholder="Conte sobre sua experiência..."
          className="resize-none"
          rows={3}
        />
        {errors.comment && <p className="text-destructive text-xs">{errors.comment.message}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="brand-gradient text-white">
          {isSubmitting ? 'Salvando...' : existingReview ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
        </Button>
        {existingReview && (
          <Button
            type="button"
            variant="destructive"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Excluir
          </Button>
        )}
      </div>
    </form>
  )
}
