'use client' // Adicionamos 'use client' porque usaremos o estado e hooks da sessão (NextAuth)

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react' // Adicionado
import { Button } from '@/presentation/components/ui/button'

export function Header() {
  // Chamamos o hook para ver se o navegador está logado no Vizin
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Viz<span className="text-indigo-600">in</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Início
          </Link>
          <Link
            href="/servicos"
            className="hover:text-indigo-600 transition-colors"
          >
            Serviços da Rede
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-indigo-600 transition-colors"
          >
            Painel do Morador
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Renderização Condicional da Sessão */}
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-md"></div>
          ) : session ? (
            // Se ESTIVER logado: Mostra Dashboard e botão sutil de Sair
            <>
              <Link href="/dashboard" passHref>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Meu Painel
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-slate-500 hover:text-red-600"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sair
              </Button>
            </>
          ) : (
            // Se NÃO estiver logado: Mostra o velho botão Padrão
            <Link href="/login" passHref>
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                Login / Cadastro
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
