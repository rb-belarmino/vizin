import NextAuth from 'next-auth';
import { authConfig } from './infrastructure/auth/auth.config';

// O Middleware (proxy.ts) inicializa o NextAuth apenas com as configs compatíveis com Edge
export default NextAuth(authConfig).auth;

export const config = {
  // O matcher agora roda em todas as páginas (para deixar a lógica toda no callback 'authorized' do auth.config.ts), 
  // exceto chamadas de api e estáticos.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
