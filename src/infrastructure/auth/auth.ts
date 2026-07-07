import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '../../lib/prisma'
import authConfig from './auth.config'
import { ResidentRepository } from '../database/resident-repository'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut, unstable_update: update } = NextAuth({
  ...authConfig,
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user) => {
      const { name, ...rest } = user
      return prisma.user.create({
        data: {
          ...rest,
          fullName: name ?? 'Usuário',
        } as any,
      })
    },
  },
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials?.password) return null

        const repository = new ResidentRepository()
        const user = await repository.findResidentByEmail(
          credentials.email as string
        )
        if (!user) return null

        // Guard: user exists but has no password (OAuth-only account, e.g. Google).
        // Return null to signal invalid credentials without throwing.
        if (!user.passwordHash) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!isValid) return null

        return {
          id: user.id,
          name: user.fullName,
          email: user.email
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt(params) {
      // 1. Executa a lógica base (Edge-friendly)
      let token = params.token;
      if (authConfig.callbacks?.jwt) {
        token = await authConfig.callbacks.jwt(params) as any;
      }
      
      // 2. Executa a lógica Node (Prisma / Auto-cura)
      const userId = token.id || token.sub;
      if (!token.apartmentId && userId) {
        const dbUser = await prisma.user.findUnique({ where: { id: userId as string } })
        token.apartmentId = dbUser?.apartmentId ?? null
      }

      return token
    }
  }
})
