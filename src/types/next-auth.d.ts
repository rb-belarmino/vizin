import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Estende a tipagem padrão da Sessão do NextAuth.
   */
  interface Session {
    user: {
      id: string;
      unitNumber?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * Estende a tipagem padrão do Usuário retornado no authorize().
   */
  interface User {
    id: string;
    unitNumber?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Estende a tipagem do token JWT para incluir nossos campos customizados.
   */
  interface JWT {
    id: string;
    unitNumber?: string | null;
  }
}
