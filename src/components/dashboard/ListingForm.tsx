'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ServiceImageDropzone } from '@/components/upload/ServiceImageDropzone'
import {
  ListingSchema,
  ListingSchemaType
} from '@/actions/schemas/listing-schema'
import { createListingAction } from '@/actions/listing-actions'

const CATEGORIES = [
  'Gastronomia',
  'Reformas',
  'Aulas',
  'Beleza',
  'Saúde',
  'Outros'
] as const

interface UploadState {
  url: string
  key: string
}

export function ListingForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<UploadState | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ListingSchemaType>({
    resolver: zodResolver(ListingSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      priceBaseline: '',
      whatsappNumber: '',
      instagramHandle: '',
      visibilityStatus: 'Public' as const,
      showApartment: true,
      portfolioImageUrl: '',
      portfolioImageKey: ''
    }
  })

  const onSubmit = async (data: ListingSchemaType) => {
    setServerError(null)
    setSuccessMessage(null)

    if (!uploadState) {
      setServerError('Por favor, faça o upload de uma imagem para continuar.')
      return
    }

    const result = await createListingAction({
      ...data,
      portfolioImageUrl: uploadState.url,
      portfolioImageKey: uploadState.key
    })

    if (result.error) {
      setServerError(result.error)
    } else {
      reset()
      setUploadState(null)
      setSuccessMessage('Serviço publicado com sucesso!')
      onSuccess?.()
      
      setTimeout(() => {
        setSuccessMessage(null)
        router.push('/dashboard')
        router.refresh()
      }, 2000)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Novo Serviço</h2>

      {serverError && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1">
        <label htmlFor="listing-title" className="block text-sm font-medium">
          Título <span className="text-destructive">*</span>
        </label>
        <input
          id="listing-title"
          {...register('title')}
          type="text"
          placeholder="Ex: Aulas de violão para iniciantes"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label
          htmlFor="listing-description"
          className="block text-sm font-medium"
        >
          Descrição <span className="text-destructive">*</span>
        </label>
        <textarea
          id="listing-description"
          {...register('description')}
          rows={5}
          placeholder={
            'Descreva seu serviço com detalhes...\n\n\n\n(Texto mínimo: 10 caracteres)'
          }
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label htmlFor="listing-category" className="block text-sm font-medium">
          Categoria <span className="text-destructive">*</span>
        </label>
        <select
          id="listing-category"
          {...register('categoryId')}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <label htmlFor="listing-price" className="block text-sm font-medium">
          Preço base{' '}
          <span className="text-muted-foreground text-xs">(opcional)</span>
        </label>
        <input
          id="listing-price"
          {...register('priceBaseline')}
          type="text"
          placeholder="Ex: A partir de R$ 50"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="listing-whatsapp"
            className="block text-sm font-medium"
          >
            WhatsApp{' '}
            <span className="text-muted-foreground text-xs">(opcional)</span>
          </label>
          <input
            id="listing-whatsapp"
            {...register('whatsappNumber')}
            type="tel"
            placeholder="5511999999999"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="listing-instagram"
            className="block text-sm font-medium"
          >
            Instagram{' '}
            <span className="text-muted-foreground text-xs">(opcional)</span>
          </label>
          <input
            id="listing-instagram"
            {...register('instagramHandle')}
            type="text"
            placeholder="seuperfil (sem @)"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Imagem do serviço <span className="text-destructive">*</span>
        </label>
        <ServiceImageDropzone
          initialImageUrl={uploadState?.url}
          onUploadBegin={() => setIsUploading(true)}
          onUploadComplete={(url, key) => {
            setIsUploading(false)
            setUploadState({ url, key })
            setValue('portfolioImageUrl', url)
            setValue('portfolioImageKey', key)
          }}
          onUploadError={error => {
            setIsUploading(false)
            setServerError(`Erro no upload: ${error.message}`)
          }}
        />
        {errors.portfolioImageUrl && (
          <p className="text-xs text-destructive">
            {errors.portfolioImageUrl.message}
          </p>
        )}
      </div>

      {/* Visibility */}
      <div className="space-y-1">
        <label
          htmlFor="listing-visibility"
          className="block text-sm font-medium"
        >
          Visibilidade
        </label>
        <select
          id="listing-visibility"
          {...register('visibilityStatus')}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Public">Público</option>
          <option value="Private">Privado (rascunho)</option>
        </select>
      </div>

      {/* Privacy */}
      <div className="flex items-center gap-2 pt-2 pb-1">
        <input
          type="checkbox"
          id="listing-show-apartment"
          {...register('showApartment')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="listing-show-apartment" className="text-sm font-medium leading-none">
          Exibir número do meu apartamento no anúncio
        </label>
      </div>

      <button
        type="submit"
        id="listing-form-submit"
        disabled={isSubmitting || isUploading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? 'Publicando...' : 'Publicar Serviço'}
      </button>
    </form>
  )
}
