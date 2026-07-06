import Link from 'next/link'
import Image from 'next/image'
import { Search, Store, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export const metadata = {
  title: 'Conheça o Vizin',
  description: 'A sua vizinhança, mais conectada e inteligente.'
}

export default function ApresentacaoPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header Simplificado */}
      <header className="absolute top-0 w-full z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Vizin Logo"
              width={40}
              height={40}
              className="rounded-xl shadow-md"
            />
            <span className="font-bold text-xl tracking-tight text-white">
              Vizin
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all shadow-sm"
          >
            Acessar o Vizin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient text-white">
        {/* Background blobs for premium feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-600/20 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative max-w-5xl text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-medium text-indigo-100 uppercase tracking-wider">
              Disponível para o seu condomínio
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            A sua vizinhança, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
              mais conectada e inteligente
            </span>
          </h1>

          <p className="text-lg md:text-xl text-indigo-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Conheça o Vizin: A plataforma definitiva para facilitar a
            comunicação e fortalecer a economia local do nosso condomínio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-indigo-900 font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Acessar o Vizin agora <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Problema vs Solução (Glassmorphism) */}
      <section className="py-24 bg-card relative z-10 -mt-8 rounded-t-[3rem] border-t border-border/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Diga adeus à desorganização
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Grupos de WhatsApp confusos e murais de papel desatualizados são
              coisas do passado. O Vizin traz clareza para a nossa comunidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Antes */}
            <div className="glass p-8 rounded-3xl border border-red-500/10 bg-red-500/5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                O Jeito Antigo
              </h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✕</span>
                  Dificuldade em descobrir quem vende aquele doce incrível no prédio.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✕</span>
                  Dificuldade em encontrar serviços ou produtos confiáveis por perto.
                </li>
              </ul>
            </div>

            {/* Depois */}
            <div className="glass p-8 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
                <ShieldCheck width="100" height="100" strokeWidth="1" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                Com o Vizin
              </h3>
              <ul className="space-y-4 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full brand-gradient text-white flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✓</span>
                  Fácil acesso a uma rede de talentos locais, a poucos passos da sua porta.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full brand-gradient text-white flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✓</span>
                  Catálogo completo para valorizar e encontrar serviços dos próprios vizinhos.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Principais */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tudo o que precisamos em um só lugar
            </h2>
            <p className="text-muted-foreground text-lg">
              Feito sob medida para facilitar a nossa convivência.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="bg-card p-8 rounded-3xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mb-6 shadow-inner">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Descubra Talentos Locais</h3>
              <p className="text-muted-foreground leading-relaxed">
                Precisando de uma faxina, de um encanador ou com vontade de comer
                um doce incrível? Encontre rapidamente serviços e produtos de
                confiança oferecidos por quem mora no seu condomínio.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-8 rounded-3xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mb-6 shadow-inner">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Classificados & Serviços</h3>
              <p className="text-muted-foreground leading-relaxed">
                Um espaço exclusivo para divulgar os talentos e negócios do
                condomínio. Encontre quem venda doces, ofereça serviços de
                manutenção (bombeiro hidráulico, eletricista), faxina e muito mais.
                Vamos fomentar a nossa economia local!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="container mx-auto px-6 max-w-4xl relative text-center">
          <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Pronto para modernizar nossa comunidade?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se aos seus vizinhos que já estão utilizando o Vizin para
            tornar o dia a dia mais prático e conectado.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full brand-gradient text-white font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg"
          >
            Acessar a Plataforma
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/logo.jpg"
              alt="Vizin Logo"
              width={24}
              height={24}
              className="rounded-md grayscale opacity-50"
            />
            <span className="font-bold tracking-tight">Vizin</span>
          </div>
          <p>
            © {new Date().getFullYear()} Vizin · Feito com ❤️ para os nossos
            vizinhos.
          </p>
        </div>
      </footer>
    </div>
  )
}
