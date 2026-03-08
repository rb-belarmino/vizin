import { Header } from '@/presentation/components/layout/header'
import { Footer } from '@/presentation/components/layout/footer'
import { HeroSection } from '@/presentation/components/home/hero-section'
import { TopServicesSection } from '@/presentation/components/home/top-services-section'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function Home() {
  const latestServices = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      provider: {
        include: {
          unit: true
        }
      }
    }
  })

  return (
    <div className="flex min-h-screen flex-col font-(family-name:--font-geist-sans)">
      <Header />

      <main className="flex-1">
        <HeroSection />

        {/* Adicionando nossa seção dinâmica injetando a lista de serviços que veio do banco */}
        <TopServicesSection data={latestServices} />

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-slate-900">
              Como funciona o Vizin?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Cadastre-se</h3>
                <p className="text-slate-600">
                  Valide sua unidade e crie seu perfil de morador na plataforma.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Anuncie ou Busque
                </h3>
                <p className="text-slate-600">
                  Ofereça seus talentos ou encontre o que precisa com seus
                  vizinhos.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Feche Negócio</h3>
                <p className="text-slate-600">
                  Contate o vizinho diretamente pelo WhatsApp e valorize a
                  comunidade local.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
