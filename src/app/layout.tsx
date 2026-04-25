import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/presentation/app/globals.css";
import Header from "@/presentation/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vizin - Vitrine de Serviços",
  description: "Descubra serviços incríveis oferecidos pelos seus vizinhos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-slate-50/50">
          {children}
        </main>
      </body>
    </html>
  );
}
