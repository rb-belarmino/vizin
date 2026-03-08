import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, MapPin, Search } from 'lucide-react'

import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'

export default async function ServicosPage() {
  // Busca todos os serviços que estão ATIVOS no banco de dados.
  // Fazemos um "include" no provider e na unit do provider para renderizar os nomes e os locais reais!
  const services = await prisma.service.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      createdAt: 'desc' // Os mais recentes aparecem primeiro
    },
    include: {
      provider: {
        include: {
          unit: true // Traz Bloco e Apartamento do prestador
        }
      }
    }
  })

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Banner / Header Simples */}
      <div className="bg-indigo-600 px-6 py-12 md:py-16 text-center shadow-inner">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Catálogo de Vizinhos
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl">
            Descubra talentos, produtos e serviços oferecidos pelos moradores do
            seu condomínio.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-8">
        {/* Futura barra de busca / Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <Link
            href="/dashboard"
            className="text-slate-500 hover:text-slate-900 transition flex items-center text-sm font-medium whitespace-nowrap"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por marmita, aula..."
              className="pl-9 bg-slate-50"
              disabled
              // Desabilitado por enquanto - Aqui podemos colocar a pesquisa por Client Component depois!
            />
          </div>
        </div>

        {/* Listagem de Serviços ou Estado Vazio */}
        {services.length === 0 ? (
          <div className="text-center bg-white py-16 rounded-2xl border border-dashed border-slate-200">
            <div className="mx-auto h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700">
              Nenhum serviço anunciado ainda
            </h2>
            <p className="text-slate-500 mt-2">
              Seja o primeiro a oferecer algo para o seu condomínio!
            </p>
            <Link href="/dashboard/new-service" className="mt-6 inline-block">
              <Button>Criar o primeiro anúncio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <Card
                key={service.id}
                className="flex flex-col h-full hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {service.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="grow space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Informação do Prestador / Morador */}
                  <div className="rounded-lg bg-slate-50 p-3 flex flex-col gap-2 border border-slate-100 mt-4">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Anunciado por
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                        {service.provider.fullName.charAt(0)}
                      </div>
                      {service.provider.fullName}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Bloco {service.provider.unit.block} - Apto{' '}
                      {service.provider.unit.number}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-100">
                  {service.contact ? (
                    <a
                      href={`https://wa.me/55${service.contact.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Chamar no WhatsApp
                      </Button>
                    </a>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      Sem contato direto
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
