# Regras do Projeto Vizin (AI Agents Rulebook)

Este arquivo define as diretrizes absolutas e limites para os agentes de IA operando no projeto Vizin (Next.js 16+, React 19, Tailwind CSS 4, Prisma). Siga rigorosamente.

## 1. Arquitetura e Limites (Clean Architecture)
- **Frontend Isolado**: `src/app` e `src/components` são estritamente para UI. NUNCA instancie Prisma, banco de dados ou NextAuth diretamente aqui.
- **Camada de Acesso (Server Actions)**: Toda comunicação Client -> Server passa por `src/actions/`. As actions validam os dados (com Zod) e chamam a camada Core.
- **Core (Regras de Negócio)**: Lógica complexa e casos de uso residem em `src/core/`. O Core não deve depender do framework Next.js.
- **Infraestrutura**: Banco de dados (Prisma), e-mails (Resend), auth e uploads (UploadThing) ficam isolados em `src/infrastructure/`. O acesso ao Prisma deve ocorrer via repositórios ou adapters específicos, não espalhado pelas actions.

## 2. Tecnologias e Padrões Obrigatórios
- **Next.js & React 19**: Utilize os padrões do App Router. Componentes por padrão são Server Components. Use `'use client'` apenas quando houver estado local (`useState`), efeitos (`useEffect`) ou eventos interativos.
- **Tailwind CSS v4**: Utilizamos a nova sintaxe do v4 (via `@tailwindcss/postcss`). Sem `tailwind.config.js`. Utilize variáveis semânticas definidas em `globals.css` (ex: `bg-background`, `text-primary`). NUNCA use cores hardcoded (ex: `bg-blue-500`).
- **Autenticação (Next-Auth v5)**: Importe a função `auth()` de `src/infrastructure/auth/auth.ts` em rotas no servidor ou Server Actions.
- **Estado Funcional/Tratamento de Erros**: Utilize a biblioteca `effect` quando houver necessidade de lidar com fluxos complexos, retornos tipados de erros e side-effects de forma funcional.

## 3. Formulários, Validação e Tipagem
- **React Hook Form + Zod**: Obrigatório para todos os formulários.
- **Single Source of Truth**: Os schemas do Zod devem ficar em `src/actions/schemas/` e ser reaproveitados tanto no `react-hook-form` (client) quanto na validação das `Server Actions` (server).

## 4. UI/UX, Componentes e Design System
- **Shadcn/Base UI**: Utilize os componentes em `src/components/ui/` sempre que possível antes de criar um novo do zero.
- **Classes de Marca e Estética**:
  - Aplique micro-interações: `.animate-fade-in`, hover effects (`hover:scale-[1.02]`, `transition-all`).
  - Para áreas nobres/hero: Use `.hero-gradient`.
  - Para destaque: Use `.brand-gradient`.
  - Para overlays, modais e fundos premium: Use `.glass` (glassmorphism).
- **Sem Placeholders Genéricos**: Use lucide-react para ícones. Para imagens, certifique-se de prever os estados de fallback se a imagem falhar.

## 5. Testes (Vitest & Playwright)
- **Unit/Integration**: Testes para hooks, regras de negócio do Core e components utilitários devem usar Vitest em `/tests/`.
- **E2E**: Fluxos críticos devem ser testados com Playwright em `/specs/`.
- **Mocks & DB**: Qualquer alteração de esquema no `prisma/schema.prisma` deve contemplar remoção em cascata (`onDelete: Cascade`). Sempre atualize o `prisma/seed.ts` quando criar entidades novas.
