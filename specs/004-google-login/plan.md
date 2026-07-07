# Implementation Plan: 004-google-login

## Goal
Integrar o login via Google utilizando o provedor de autenticação atual (NextAuth/Auth.js), ajustando o schema do Prisma para suportar OAuth, e implementar um fluxo de onboarding obrigatório para capturar o número do apartamento de novos residentes.

## Summary
Adicionar o Google como provedor de autenticação no Auth.js. Mapear a interface de login (`/login` e `/signup`) para incluir o botão "Continuar com o Google". Alterar o banco de dados para tornar o `apartmentId` e o `passwordHash` opcionais, permitindo a criação do usuário pelo Google. Lidar com a mesclagem automática de contas (Account Linking) pelo e-mail caso o usuário já possua uma conta com senha. Criar um fluxo de onboarding protegido (`/onboarding`) com opção de Logout, que força usuários recém-chegados (sem apartamento definido) a preencherem esse dado antes de prosseguirem para as rotas autenticadas (como o `/dashboard`).

## Technical Context
- Next.js 16 (App Router)
- React 19 Server Components
- Clean Architecture
- Prisma ORM
- NextAuth/Auth.js v5 (com Prisma Adapter)
- TailwindCSS

## Architecture Map
- `app/(public)/login/page.tsx` - Atualizar para incluir componente de login do Google
- `app/(onboarding)/onboarding/page.tsx` - Nova rota obrigatória para preenchimento de apartamento (com botão de logout)
- `app/(private)/dashboard/profile/page.tsx` - Atualizar o formulário de Segurança para suportar a criação de senha local para Contas Híbridas.
- `actions/auth-actions.ts` - Atualizar lógicas de login e server actions para onboarding e logout
- `actions/password-actions.ts` - Incluir server action para criar nova senha local
- `core/use-cases/update-apartment.ts` - Use case para salvar o apartamento no onboarding
- `core/use-cases/set-local-password.ts` - Use case para permitir a configuração de senha para contas originárias do Google.
- `infrastructure/auth/auth.config.ts` - Configurações Edge-friendly, callbacks base de session/JWT e rotas exportadas para o Middleware.
- `infrastructure/auth/auth.ts` - Configuração Node-friendly, integrando GoogleProvider e Prisma Adapter, com callbacks de Auto Cura.
- `proxy.ts` - O arquivo oficial de Middleware (nova convenção do Next.js) que interceptará rotas para garantir que usuários sem apartamento sejam redirecionados para o `/onboarding`.
- `prisma/schema.prisma` - Atualizar os campos `apartmentId` e `passwordHash` para serem opcionais (`?`). Adicionar o model `Account` e demais models auxiliares necessários para o funcionamento pleno do PrismaAdapter.

## Components & Data Flow
1. **Login Flow**: Na tela de login, o clique no botão "Continuar com o Google" dispara a function `signIn("google")` do Auth.js.
2. **Account Linking**: O Prisma Adapter cuidará de criar as entries em `Account` e relacioná-las a `User`. Caso o e-mail exista, o NextAuth.js permitirá o linking silêncioso.
3. **Session & Middleware**: O JWT persistirá informando se o usuário possui `apartmentId`. O middleware de rota (`proxy.ts`) lerá esses dados via `auth.config.ts`. Se for nulo e o usuário tentar acessar `/dashboard`, será redirecionado para `/onboarding`.
4. **Onboarding**: A página de onboarding utiliza um formulário com Server Action para atualizar o perfil no banco. Ao persistir, atualiza-se o JWT e redireciona para o `/dashboard`.
5. **Conta Híbrida**: Na tela de perfil, caso o usuário tenha um `passwordHash` nulo, ele visualiza a opção "Criar Senha Local". A Server Action atualiza a senha no banco, permitindo que o usuário faça login tradicional via e-mail no futuro.
