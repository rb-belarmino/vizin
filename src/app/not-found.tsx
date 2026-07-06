import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Página não encontrada — Vizin',
  description: 'A página que você tentou acessar não existe.'
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar simplificada */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-5xl h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.jpg"
              alt="Vizin Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="font-bold text-lg tracking-tight">Vizin</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-24 h-24 rounded-3xl brand-gradient flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Erro 404</h1>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Página não encontrada
            </h2>
            <p className="text-muted-foreground mt-4">
              Desculpe, não conseguimos encontrar a página que você está
              procurando.
            </p>
          </div>

          <Link
            href="/"
            className="mt-4 px-6 py-3 rounded-full brand-gradient text-white font-semibold shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Voltar para o Catálogo
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Vizin · Feito com ❤️ para os nossos
          vizinhos
        </p>
      </footer>
    </div>
  )
}
