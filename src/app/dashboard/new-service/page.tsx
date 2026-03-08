'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
// Instale a textarea caso não tenha: npx shadcn@latest add textarea, ou use <textarea> normal
// import { Textarea } from '@/presentation/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'

// Lembre-se de importar o arquivo do local correto onde você salvou a Server Action
import { createService } from '@/app/actions/service-actions'

export default function NovoServicoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const category = formData.get('category') as string

    if (!title || !category) {
      toast.warning('Campos incompletos', {
        description: 'Por favor, preencha o título e a categoria.'
      })
      setIsLoading(false)
      return
    }

    // Call the server action to save the service
    const response = await createService(formData)

    if (response?.error) {
      toast.error('Erro ao anunciar', {
        description: response.error
      })
      // Só aqui havia o false, por isso só parava a rodinha quando dava erro.
      setIsLoading(false)
      return
    }

    // Se passou do if acima, deu sucesso.
    // AGORA TEMOS QUE PARAR A RODA DE CARREGAR AQUI TAMBÉM SE VAI DAR ROUTER.PUSH
    setIsLoading(false)

    toast.success('Serviço Anunciado!', {
      description: 'Seu serviço já está online para os moradores verem.'
    })

    // Deixe apenas o push. Removeremos o router.refresh()
    // porque o Next já limpa o cache daquela página de destino via Turbopack no start-transition!
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Navigation / Header */}
        <div className="mb-6 flex items-center">
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-slate-900 transition flex items-center text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Painel
          </Link>
        </div>

        <Card className="w-full shadow-sm border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Anunciar um Novo Serviço
            </CardTitle>
            <CardDescription>
              Ofereça seu talento, produtos ou aulas para outros moradores do
              Vizin.
            </CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit} noValidate>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título do Serviço <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex: Marmitas Fit Congeladas, Aulas de Inglês..."
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Category & Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  {/* Se preferir pode usar o componente Select do Shadcn depois. Aqui uso um nativo rápido */}
                  <select
                    id="category"
                    name="category"
                    disabled={isLoading}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione...</option>
                    <option value="Alimentação">
                      Alimentação / Gastronomia
                    </option>
                    <option value="Beleza">Beleza / Estética</option>
                    <option value="Manutenção">Manutenção / Consertos</option>
                    <option value="Aulas">Aulas / Informática</option>
                    <option value="Pets">Pets / Passeador</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact" className="text-sm font-medium">
                    WhatsApp (Opcional)
                  </label>
                  <Input
                    id="contact"
                    name="contact"
                    type="text"
                    placeholder="Ex: (11) 90000-0000"
                    disabled={isLoading}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Isso ficará público no seu anúncio.
                  </p>
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Detalhe como funciona seu serviço, os dias que você atende, valores, etc."
                  disabled={isLoading}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50/50 pt-6 px-6 pb-6 rounded-b-xl border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando Anúncio...
                  </>
                ) : (
                  'Publicar Serviço'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
