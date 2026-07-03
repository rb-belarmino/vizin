import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import authConfig from "./auth.config"

// We will add the actual db validation here later in the User Story
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Placeholder until User Story 2 is implemented
        return null;
      },
    }),
  ],
})
