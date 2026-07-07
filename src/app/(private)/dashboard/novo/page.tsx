import { ListingForm } from '@/components/dashboard/ListingForm'
import Link from 'next/link'

export const metadata = {
  title: 'Novo Serviço | Vizin'
}

export default function NewServicePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Criar Novo Serviço</h1>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
      </div>

      <section className="bg-card border rounded-2xl p-6 shadow-sm">
        <ListingForm />
      </section>
    </div>
  )
}
