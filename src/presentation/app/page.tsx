import prisma from '@/infrastructure/db/client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import { MessageCircle, Globe, UtensilsCrossed, Hammer, BookOpen, Sparkles, HeartPulse, Package, Share2 } from 'lucide-react'
import { FaInstagram, FaFacebook } from 'react-icons/fa'
import { cn } from "@/presentation/lib/utils";

import { Suspense } from "react";
import HomeFilters from "@/presentation/components/home-filters";
import ShareButton from "@/presentation/components/share-button";

const categoryColors: Record<string, string> = {
  Gastronomia: "bg-orange-100 text-orange-700 border-orange-200",
  Reformas: "bg-blue-100 text-blue-700 border-blue-200",
  Aulas: "bg-purple-100 text-purple-700 border-purple-200",
  Beleza: "bg-pink-100 text-pink-700 border-pink-200",
  Saúde: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Outros: "bg-slate-100 text-slate-700 border-slate-200",
};

const categoryIcons: Record<string, any> = {
  Gastronomia: UtensilsCrossed,
  Reformas: Hammer,
  Aulas: BookOpen,
  Beleza: Sparkles,
  Saúde: HeartPulse,
  Outros: Package,
};

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const category =
    typeof params.category === 'string' ? params.category : undefined

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
            <Card
              key={service.id}
              className="flex flex-col h-full border-border/50 hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <Badge 
                      className={cn(
                        "font-medium border shadow-none flex items-center gap-1.5",
                        categoryColors[service.category] || categoryColors.Outros
                      )}
                    >
                      {(() => {
                        const Icon = categoryIcons[service.category] || categoryIcons.Outros;
                        return <Icon size={14} />;
                      })()}
                      {service.category}
                    </Badge>
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-transparent">
                      {service.serviceType}
                    </Badge>
                  </div>
                  {service.priceInfo && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                      {service.priceInfo}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl line-clamp-1">
                  {service.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 mt-2 text-sm">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                {/* Reserved for future content, e.g., reviews or user info */}
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 pt-4 border-t bg-muted/20">
                {service.whatsapp && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-emerald-500 border-emerald-500 hover:bg-emerald-50"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {service.instagram && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-indigo-500 border-indigo-200 hover:bg-indigo-50"
                    asChild
                  >
                    <a
                      href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                    >
                      <FaInstagram className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {service.facebook && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    asChild
                  >
                    <a
                      href={
                        service.facebook.startsWith('http')
                          ? service.facebook
                          : `https://${service.facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Facebook"
                    >
                      <FaFacebook className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {service.website && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-slate-600 border-slate-200 hover:bg-slate-50"
                    asChild
                  >
                    <a
                      href={
                        service.website.startsWith('http')
                          ? service.website
                          : `https://${service.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Website"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {!service.whatsapp &&
                  !service.instagram &&
                  !service.facebook &&
                  !service.website && (
                    <span className="text-xs text-muted-foreground italic">
                      Nenhum contato disponível
                    </span>
                  )}
                
                <ShareButton title={service.title} serviceId={service.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
