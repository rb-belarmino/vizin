import { Search } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'

export function HeroSection() {
  return (
    <section className="bg-slate-50 px-4 py-20 text-center md:py-32">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Encontre os Serviços de Seus Vizinhos no Edifício Criação
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl">
          Central de talentos exclusiva para moradores. Seguro, rápido e
          prático.
        </p>

        <div className="mx-auto flex w-full max-w-2xl items-center relative mt-8">
          <Search className="absolute left-4 h-5 w-5 text-indigo-600" />
          <Input
            type="text"
            placeholder="Buscar Marmita, Personal, Encanador..."
            className="h-14 w-full rounded-full border-slate-300 pl-12 pr-4 text-lg shadow-sm focus-visible:ring-indigo-600"
          />
          <Button className="absolute right-2 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 px-6">
            Buscar
          </Button>
        </div>
      </div>
    </section>
  )
}
