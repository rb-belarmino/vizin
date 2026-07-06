/* eslint-disable */
import { fetchPublicListings } from '@/actions/catalog-actions'
import { CategoryPills } from '@/components/catalog/CategoryPills'
import { ListingCard } from '@/components/catalog/ListingCard'
import Link from 'next/link'
import { auth } from '@/infrastructure/auth/auth'

export const metadata = {
  title: 'Vizin — Serviços do Condomínio',
  description: 'Catálogo de serviços oferecidos pelos moradores do condomínio.'
}

export default async function PublicCatalogPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams

  const categoryId =
    typeof resolvedParams.category === 'string'
      ? resolvedParams.category
      : undefined
  const searchQuery =
    typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  const listings = await fetchPublicListings({ categoryId, searchQuery })
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-5xl h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white text-xs font-black">V</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Vizin</span>
          </Link>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  id="nav-dashboard-btn"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full brand-gradient flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {session.user.name?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">Painel</span>
                </Link>
                <Link
                  href="/dashboard"
                  id="nav-publicar-btn"
                  className="text-sm font-semibold px-4 py-1.5 rounded-full brand-gradient text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                  Publicar serviço
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  id="nav-entrar-btn"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/login"
                  id="nav-publicar-btn"
                  className="text-sm font-semibold px-4 py-1.5 rounded-full brand-gradient text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                  Publicar serviço
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient text-white py-16 px-4 relative overflow-hidden">
        {/* decorative blobs */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-5xl relative">
          <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-3">
            Catálogo do Condomínio
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Seus vizinhos oferecem
            <br />
            <span className="text-indigo-300">serviços incríveis</span>
          </h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-lg">
            Gastronomia, reformas, aulas, beleza e muito mais. Tudo dentro do
            seu condomínio.
          </p>

          {/* Search bar */}
          <form
            method="GET"
            action="/"
            className="flex items-center gap-2 max-w-xl"
          >
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6.5 1a5.5 5.5 0 1 0 3.41 9.824l3.383 3.383a.75.75 0 0 0 1.06-1.06l-3.383-3.383A5.5 5.5 0 0 0 6.5 1zM2.5 6.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                  fill="currentColor"
                />
              </svg>
              <input
                type="search"
                name="q"
                id="catalog-search"
                defaultValue={searchQuery ?? ''}
                placeholder="Buscar serviços..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/40 text-sm"
                autoComplete="off"
              />
            </div>
            {categoryId && (
              <input type="hidden" name="category" value={categoryId} />
            )}
            <button
              type="submit"
              id="catalog-search-btn"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-colors border border-white/20 whitespace-nowrap"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {/* Category filters */}
        <section className="mb-8">
          <CategoryPills />
        </section>

        {/* Results header */}
        {(searchQuery || categoryId) && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {listings.length === 0
                ? 'Nenhum resultado para'
                : `${listings.length} resultado${listings.length !== 1 ? 's' : ''} para`}{' '}
              {searchQuery && (
                <strong className="text-foreground">"{searchQuery}"</strong>
              )}
              {categoryId && (
                <span className="text-foreground">
                  {' '}
                  em <strong>{categoryId}</strong>
                </span>
              )}
            </p>
            <Link
              href="/"
              id="clear-filters-btn"
              className="text-xs text-primary hover:underline font-medium"
            >
              Limpar filtros
            </Link>
          </div>
        )}

        {/* Grid */}
        <section>
          {listings.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center opacity-40">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  Nenhum serviço encontrado
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Tente selecionar outra categoria ou buscar por termos
                  diferentes.
                </p>
              </div>
              <Link
              href="/"
                id="empty-state-clear-btn"
                className="px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
              >
                Ver todos os serviços
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, i) => (
                <div
                  key={listing.id}
                  className="animate-slide-up block h-full focus:outline-none"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ListingCard listing={listing} priority={i < 4} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Vizin · Feito com ❤️ pelos moradores</p>
      </footer>
    </div>
  )
}
