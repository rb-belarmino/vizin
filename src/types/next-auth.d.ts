import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      apartmentId: number | null;
    } & DefaultSession['user'];
  }

  interface User {
    apartmentId?: number | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    apartmentId?: number | null;
  }
}
