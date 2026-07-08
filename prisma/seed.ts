/**
 * Prisma Seed Script — Vizin Marketplace
 * Populates the database with realistic demo listings for development.
 * Run: npm run db:seed
 */
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const demoUsers = [
  {
    fullName: 'Ana Beatriz Costa',
    email: 'ana@vizin.demo',
    password: 'demo1234',
    apartmentId: 101
  },
  {
    fullName: 'Carlos Henrique Lima',
    email: 'carlos@vizin.demo',
    password: 'demo1234',
    apartmentId: 205
  },
  {
    fullName: 'Mariana Oliveira',
    email: 'mariana@vizin.demo',
    password: 'demo1234',
    apartmentId: 312
  },
  {
    fullName: 'Roberto Ferreira',
    email: 'roberto@vizin.demo',
    password: 'demo1234',
    apartmentId: 408
  }
]

// Unsplash photos — all free to use
const listings = [
  // Gastronomia
  {
    userEmail: 'ana@vizin.demo',
    title: 'Marmitas fitness semanais',
    description:
      'Marmitas saudáveis e balanceadas, preparadas com ingredientes frescos. Cardápio semanal com variedade. Entrega no condomínio toda segunda-feira. Consulte o cardápio da semana!',
    categoryId: 'Gastronomia',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    portfolioImageKey: 'demo-gastronomia-marmita',
    priceBaseline: 'A partir de R$ 18/unidade',
    whatsappNumber: '5511991234001',
    instagramHandle: 'anacozinha',
    visibilityStatus: 'Public'
  },
  {
    userEmail: 'ana@vizin.demo',
    title: 'Bolos artesanais para encomenda',
    description:
      'Bolos decorados para aniversários, casamentos e eventos. Sabores: baunilha, chocolate, morango e red velvet. Personalizo o design conforme sua ideia!',
    categoryId: 'Gastronomia',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    portfolioImageKey: 'demo-gastronomia-bolo',
    priceBaseline: 'A partir de R$ 80',
    whatsappNumber: '5511991234001',
    instagramHandle: null,
    visibilityStatus: 'Public'
  },

  // Reformas
  {
    userEmail: 'carlos@vizin.demo',
    title: 'Pintura residencial e acabamentos',
    description:
      'Pintura interna e externa com material de primeira qualidade. Experiência de 10 anos. Orçamento grátis e sem compromisso. Trabalho limpo e pontual.',
    categoryId: 'Reformas',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80',
    portfolioImageKey: 'demo-reformas-pintura',
    priceBaseline: 'A partir de R$ 30/m²',
    whatsappNumber: '5511991234002',
    instagramHandle: 'carlosreformas',
    visibilityStatus: 'Public'
  },
  {
    userEmail: 'roberto@vizin.demo',
    title: 'Montagem de móveis e instalações',
    description:
      'Montagem de móveis de todos os fabricantes (IKEA, Tok&Stok, Leroy Merlin, etc.). Instalação de lustres, prateleiras e persianas. Rápido e cuidadoso.',
    categoryId: 'Reformas',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    portfolioImageKey: 'demo-reformas-moveis',
    priceBaseline: 'A partir de R$ 80',
    whatsappNumber: '5511991234004',
    instagramHandle: null,
    visibilityStatus: 'Public'
  },

  // Aulas
  {
    userEmail: 'mariana@vizin.demo',
    title: 'Aulas de violão para iniciantes',
    description:
      'Aulas presenciais no meu apartamento ou no seu. Metodologia simples e divertida para quem nunca tocou. Aprenda músicas que você ama desde a primeira aula!',
    categoryId: 'Aulas',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
    portfolioImageKey: 'demo-aulas-violao',
    priceBaseline: 'R$ 60/hora',
    whatsappNumber: '5511991234003',
    instagramHandle: 'marimusica',
    visibilityStatus: 'Public'
  },
  {
    userEmail: 'carlos@vizin.demo',
    title: 'Reforço de Matemática e Física',
    description:
      'Reforço escolar para alunos do ensino fundamental e médio. Professor formado em Engenharia. Aulas individuais ou em pequenos grupos. Aprovação garantida!',
    categoryId: 'Aulas',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
    portfolioImageKey: 'demo-aulas-matematica',
    priceBaseline: 'R$ 70/hora',
    whatsappNumber: '5511991234002',
    instagramHandle: null,
    visibilityStatus: 'Public'
  },

  // Beleza
  {
    userEmail: 'ana@vizin.demo',
    title: 'Manicure e pedicure a domicílio',
    description:
      'Manicure e pedicure profissional no conforto da sua casa. Materiais esterilizados e descartáveis. Esmaltação em gel, francesinha e nail art. Agende já!',
    categoryId: 'Beleza',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
    portfolioImageKey: 'demo-beleza-manicure',
    priceBaseline: 'A partir de R$ 40',
    whatsappNumber: '5511991234001',
    instagramHandle: 'anaunhas',
    visibilityStatus: 'Public'
  },

  // Saúde
  {
    userEmail: 'mariana@vizin.demo',
    title: 'Personal trainer — treino no condomínio',
    description:
      'Treinos personalizados na academia do condomínio ou na área de lazer. Avaliação física gratuita na primeira consulta. Resultados em 4 semanas!',
    categoryId: 'Saúde',
    portfolioImageUrl:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    portfolioImageKey: 'demo-saude-personal',
    priceBaseline: 'R$ 80/sessão',
    whatsappNumber: '5511991234003',
    instagramHandle: 'marifit',
    visibilityStatus: 'Public'
  }
]

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create demo users
  const userMap: Record<string, string> = {}
  for (const user of demoUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email }
    })
    if (existing) {
      userMap[user.email] = existing.id
      console.log(`  ↩ Usuário já existe: ${user.email}`)
      continue
    }
    const passwordHash = await bcrypt.hash(user.password, 10)
    const created = await prisma.user.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
        apartmentId: user.apartmentId
      }
    })
    userMap[user.email] = created.id
    console.log(
      `  ✓ Usuário criado: ${user.fullName} (Apto ${user.apartmentId})`
    )
  }

  // Create demo listings
  for (const listing of listings) {
    const providerId = userMap[listing.userEmail]
    const existing = await prisma.serviceListing.findFirst({
      where: { title: listing.title, providerId }
    })
    if (existing) {
      console.log(`  ↩ Listing já existe: "${listing.title}"`)
      continue
    }
    await prisma.serviceListing.create({
      data: {
        title: listing.title,
        description: listing.description,
        categoryId: listing.categoryId,
        portfolioImageUrl: listing.portfolioImageUrl,
        portfolioImageKey: listing.portfolioImageKey,
        priceBaseline: listing.priceBaseline,
        whatsappNumber: listing.whatsappNumber,
        instagramHandle: listing.instagramHandle,
        visibilityStatus: listing.visibilityStatus,
        providerId
      }
    })
    console.log(`  ✓ Serviço criado: "${listing.title}"`)
  }

  // Create demo reviews
  const dbListings = await prisma.serviceListing.findMany()
  const dbUsers = await prisma.user.findMany()

  for (const listing of dbListings) {
    const nonProviders = dbUsers.filter(u => u.id !== listing.providerId)
    // Add 1 to 2 random reviews for each listing
    const numReviews = Math.floor(Math.random() * 2) + 1

    for (let i = 0; i < numReviews; i++) {
      if (nonProviders[i]) {
        const rating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
        const existingReview = await prisma.review.findFirst({
          where: { authorId: nonProviders[i].id, serviceListingId: listing.id }
        })

        if (!existingReview) {
          await prisma.review.create({
            data: {
              rating,
              comment:
                rating === 5
                  ? 'Excelente serviço, super recomendo!'
                  : 'Muito bom, profissional.',
              authorId: nonProviders[i].id,
              serviceListingId: listing.id
            }
          })
        }
      }
    }
  }
  console.log(`  ✓ Avaliações criadas!`)

  console.log('\n✅ Seed concluído!')
  console.log('\n📧 Contas demo disponíveis (senha: demo1234):')
  for (const user of demoUsers) {
    console.log(`   ${user.email} — Apto ${user.apartmentId}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
