import { CheckCircle } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/presentation/components/ui/card'
import { mockServices } from '@/lib/mock-data'

export function FeaturedServices() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Serviços em Destaque
        </h2>
        <p className="mt-2 text-slate-600">
          Descubra os talentos do seu condomínio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockServices.map(service => (
          <Card
            key={service.id}
            className="flex flex-col overflow-hidden border-slate-200 transition-all hover:shadow-md"
          >
            <div className="aspect-square w-full overflow-hidden bg-slate-100">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="mb-2 flex items-center justify-between">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex gap-1 items-center px-2 py-0.5 border-none">
                  <CheckCircle className="h-3 w-3" />
                  Morador Verificado
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">
                {service.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 line-clamp-2">
                {service.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-1 flex items-end">
              <div className="font-semibold text-indigo-600 text-lg mt-2">
                {service.price}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Saber mais
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
