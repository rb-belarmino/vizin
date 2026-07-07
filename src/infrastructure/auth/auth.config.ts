import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnboarding = nextUrl.pathname.startsWith('/onboarding')
      
      const hasApartment = auth?.user?.apartmentId !== null && auth?.user?.apartmentId !== undefined

      if (isOnDashboard) {
        if (isLoggedIn) {
          if (!hasApartment) {
            return Response.redirect(new URL('/onboarding', nextUrl))
          }
          return true
        }
        return false
      }

      if (isOnboarding) {
        if (!isLoggedIn) return false
        if (hasApartment) {
          return Response.redirect(new URL('/dashboard', nextUrl))
        }
        return true
      }

      return true
    },
    jwt({ token, trigger, session, user }) {
      if (user) {
        token.id = user.id
        // Map database 'fullName' to NextAuth 'name'
        token.name = (user as any).fullName || user.name
      }
      if (trigger === 'update') {
        if (session?.user?.apartmentId) {
          token.apartmentId = session.user.apartmentId
        } else if (session?.apartmentId) {
          token.apartmentId = session.apartmentId
        }
      }
      return token
    },
    session({ session, token }) {
      if (token?.id || token?.sub) {
        session.user.id = (token.id || token.sub) as string
        session.user.apartmentId = token.apartmentId as number | null
        if (token.name) {
          session.user.name = token.name as string
        }
      }
      return session
    }
  },
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 4 * 60 * 60 // renew every 4 hours
  }
} satisfies NextAuthConfig
