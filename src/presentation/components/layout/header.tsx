import Link from 'next/link'
import { Button } from '@/presentation/components/ui/button'

export function Header() {
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
            Meus Serviços
          </Link>
          <Link
            href="/perfil"
            className="hover:text-indigo-600 transition-colors"
          >
            Perfil
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Login/Acesso
          </Button>
        </div>
      </div>
    </header>
  )
}
