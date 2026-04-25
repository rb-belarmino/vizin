import type { NextAuthConfig } from "next-auth";

// Esta configuração roda no Edge Runtime (Middleware/Proxy)
// Aqui NÃO podemos importar bcryptjs ou Prisma
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redireciona para o login
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.unitNumber = user.unitNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.unitNumber = token.unitNumber as string;
      }
      return session;
    }
  },
  providers: [], // Os provedores reais ficam no auth.ts (Node Runtime)
} satisfies NextAuthConfig;
