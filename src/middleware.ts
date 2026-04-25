import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protege a rota /dashboard e todas as suas sub-rotas
  // O matcher usa regex para ignorar caminhos públicos de API, estáticos (/_next), imagens e favicon
  matcher: ["/dashboard/:path*"],
};
