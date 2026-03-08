import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, PackageSearch, Activity, PenLine } from 'lucide-react'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/presentation/auth/logout-button'
import { Button } from '@/presentation/components/ui/button'

export default async function DashboardPage() {
  // 1. Recover the session securely
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login')
  }

  // Obtenha o ID do usuário para as consultas
  const userId = (session.user as any).id as string
  const { name, email, role } = session.user as any

  // 2. Fetch the resident's Unit and their own published Services
  const userWithData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      unit: true, // Traz os dados de bloco/apartamento
      services: {
        // Traz apenas os serviços criados por este usuário
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // Fallback caso ocorra um erro estranho de sincronismo
  if (!userWithData) return <div>Erro ao carregar dados do usuário.</div>

  const myServices = userWithData.services

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Painel do Morador
            </h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo,{' '}
              <span className="font-semibold text-slate-700">{name}</span>!
              (Unidade {userWithData.unit.block}-{userWithData.unit.number})
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* NOVO: Botão para Voltar à Home Page */}
            <Link href="/">
              <Button variant="outline" className="border-slate-200">
                Página Inicial
              </Button>
            </Link>

            <Link href="/services">
              <Button
                variant="secondary"
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                <PackageSearch className="mr-2 h-4 w-4" />
                Explorar Rede
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </header>

        {/* Informações Resumidas */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Meus Anúncios Ativos
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {myServices.filter(s => s.isActive).length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Anunciado
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {myServices.length}
            </p>
          </div>
        </div>

        {/* Gerenciamento dos Próprios Serviços */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Meus Serviços
              </h2>
              <p className="text-sm text-muted-foreground">
                Gerencie o que você está oferecendo para seus vizinhos.
              </p>
            </div>
            <Link href="/dashboard/new-service">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Anúncio
              </Button>
            </Link>
          </div>

          <div className="p-0">
            {myServices.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Activity className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Nenhum serviço publicado
                </h3>
                <p className="text-slate-500 mt-1 max-w-sm">
                  Você ainda não ofereceu nenhum produto ou serviço para a
                  comunidade do seu condomínio.
                </p>
                <Link href="/dashboard/new-service" className="mt-6">
                  <Button variant="outline">Começar a anunciar</Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {myServices.map(service => (
                  <li
                    key={service.id}
                    className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {service.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {service.isActive ? 'Ativo' : 'Pausado'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">
                          {service.category}
                        </span>
                        {service.contact && (
                          <span>Contato: {service.contact}</span>
                        )}
                        <span>
                          • Publicado em{' '}
                          {new Date(service.createdAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Botão para futura implementação de "Editar Serviço" */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600"
                    >
                      <PenLine className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
