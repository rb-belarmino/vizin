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
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    }
  },
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 4 * 60 * 60 // renew every 4 hours
  }
} satisfies NextAuthConfig
