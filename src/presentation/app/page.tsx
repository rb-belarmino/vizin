import prisma from '@/infrastructure/db/client'
import { Suspense } from "react";
import HomeFilters from "@/presentation/components/home-filters";
import { ServiceCard } from "@/presentation/components/services/service-card";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const category = typeof params.category === 'string' ? params.category : undefined

  const services = await prisma.service.findMany({
    where: {
      isPublic: true,
      category: category || undefined,
      OR: search
        ? [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        : undefined
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl">
          Vitrine Vizin
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Descubra serviços incríveis oferecidos pelos seus vizinhos.
        </p>
      </div>

      <Suspense fallback={<div className="h-24 bg-slate-100 animate-pulse rounded-lg mb-10" />}>
        <HomeFilters />
      </Suspense>

      {services.length === 0 ? (
        <div className="text-center text-muted-foreground mt-20">
          Nenhum serviço encontrado para sua busca.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
