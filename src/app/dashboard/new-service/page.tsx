'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createService } from '@/app/actions/service-actions'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'
import { toast } from 'sonner'
import { UploadButton } from '@/utils/uploadthing'

export default function NewServicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    // Adiciona a imagem no formData caso ela tenha sido feito o upload
    if (imageUrl) {
      formData.append('imageUrl', imageUrl)
    }

    const result = await createService(formData)

    if (result.success) {
      toast.success('Serviço publicado com sucesso!')
      router.push('/dashboard')
    } else {
      toast.error(result.error || 'Ocorreu um erro ao anunciar o serviço.')
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Anunciar Novo Serviço</CardTitle>
          <CardDescription>
            Preencha as informações para oferecer seu serviço aos vizinhos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* INÍCIO DO UPLOAD DE IMAGEM */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Foto do Serviço (Opcional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-green-600 font-semibold mb-2">
                      Imagem enviada com sucesso!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImageUrl('')}
                    >
                      Remover / Trocar
                    </Button>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="serviceImage"
                    onClientUploadComplete={res => {
                      if (res && res[0]) {
                        setImageUrl(res[0].url)
                        toast.success('Imagem enviada com sucesso!')
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Erro no envio: ${error.message}`)
                    }}
                  />
                )}
              </div>
            </div>
            {/* FIM DO UPLOAD DE IMAGEM */}

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título do Serviço
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Aulas de violão, Bolos caseiros..."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria
              </label>
              <Input
                id="category"
                name="category"
                placeholder="Ex: Alimentação, Aulas, Manutenção"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-25 resize-none"
                placeholder="Descreva o que você oferece, horários, preços, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact" className="text-sm font-medium">
                Contato (WhatsApp)
              </label>
              <Input
                id="contact"
                name="contact"
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="websiteUrl" className="text-sm font-medium">
                Site ou Instagram (Opcional)
              </label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                placeholder="https://instagram.com/seu_perfil"
                type="url"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Publicando...' : 'Publicar Serviço'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
