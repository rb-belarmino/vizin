import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'

// Definimos o shape dos dados que essa seção espera receber da página principal
interface TopServicesProps {
  data: any[] // Idealmente usaríamos os tipos gerados pelo Prisma aqui, mas "any" funciona para o MVP UI
}

export function TopServicesSection({ data }: TopServicesProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Novidades no Condomínio
            </h2>
            <p className="mt-2 text-slate-600">
              Confira os últimos serviços anunciados pelos seus vizinhos.
            </p>
          </div>
          <Link href="/servicos">
            <Button variant="outline" className="hidden md:flex">
              Ver todos os serviços
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50">
            <p className="text-slate-500 mb-4">
              Ainda não há serviços anunciados. Seja pioneiro!
            </p>
            <Link href="/register">
              <Button size="sm">Fazer meu Cadastro</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(item => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-6">
                  {/* Categoria Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Recém chegado
                    </span>
                  </div>

                  {/* Titulo e Descrição */}
                  <h3 className="mb-2 text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    <Link href="/servicos">
                      {/* O "absolute inset-0" faz toda a área do card ser clicável! */}
                      <span className="absolute inset-0"></span>
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mb-6 flex-1 text-sm text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Informação do Vizinho */}
                  <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs">
                      {item.provider.fullName.charAt(0)}
                    </div>
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-slate-900">
                        {item.provider.fullName.split(' ')[0]}
                      </span>
                      <span className="flex items-center text-slate-500">
                        <MapPin className="mr-1 h-3 w-3" />
                        Bloco {item.provider.unit.block}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/servicos">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver todos os serviços
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
