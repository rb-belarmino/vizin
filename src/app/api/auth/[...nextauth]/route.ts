import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

// No App Router (v4), precisamos exportar a instância como funções HTTP
export { handler as GET, handler as POST }
