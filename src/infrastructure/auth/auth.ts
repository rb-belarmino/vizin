import NextAuth, { CredentialsSignin } from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../db/client";

// Este arquivo roda no ambiente Node.js, onde podemos usar o bcrypt tranquilamente!
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[AUTH DEBUG] Iniciando autorização para o e-mail:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH DEBUG] Faltou e-mail ou senha.");
          throw new CredentialsSignin("E-mail e senha são obrigatórios.");
        }

        const email = credentials.email as string;

        console.log("[AUTH DEBUG] Buscando usuário no banco...");
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          console.log("[AUTH DEBUG] Usuário não encontrado no banco de dados.");
          throw new CredentialsSignin("Nenhuma conta encontrada com este e-mail.");
        }

        console.log("[AUTH DEBUG] Usuário encontrado. ID:", user.id);

        console.log("[AUTH DEBUG] Comparando senhas...");
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

        console.log("[AUTH DEBUG] bcrypt.compare retornou:", isPasswordValid);

        if (!isPasswordValid) {
          throw new CredentialsSignin("Senha incorreta.");
        }

        console.log("[AUTH DEBUG] Login bem-sucedido!");

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          unitNumber: user.unitNumber,
        };
      }
    })
  ]
});
