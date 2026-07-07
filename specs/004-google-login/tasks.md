---
description: "Task list for Google Login Integration"
---

# Tasks: Google Login Integration

**Input**: Design documents from `/specs/004-google-login/`

**Prerequisites**: plan.md, spec.md

**Tests**: TDD é não-negociável. Os testes DEVEM ser escritos antes dos use-cases e Server Actions.

---

## Phase 1: Database Migration (Blocking Prerequisite)

**Purpose**: Ajustar o schema do Prisma para suportar OAuth. Nada mais pode ser feito antes disso.

- [ ] T001 [P] Atualizar `prisma/schema.prisma`: tornar `passwordHash` e `apartmentId` opcionais (`?`) no model `User`
- [ ] T002 [P] Adicionar o model `Account` (e demais models exigidos pelo PrismaAdapter do Auth.js: `Session`, `VerificationToken`) ao `prisma/schema.prisma` com relações e `onDelete: Cascade` adequados
- [ ] T003 Executar a migration: `npx prisma migrate dev --name add-oauth-account-model`
- [ ] T004 Executar `npx prisma generate` para regenerar o Prisma Client

**Checkpoint**: Schema migrado com sucesso. O banco aceita `User` sem `apartmentId` e `passwordHash`.

---

## Phase 2: Auth.js — Google Provider

**Purpose**: Habilitar o provedor do Google e conectar o Auth.js ao banco via Prisma Adapter.

- [ ] T005 Obter as credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/) (criar projeto → APIs & Services → Credentials → OAuth 2.0 Client ID, com `http://localhost:3000/api/auth/callback/google` como Authorized Redirect URI) e adicionar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` ao `.env`. **⚠️ Sem isso o servidor não sobe com o GoogleProvider ativo.**
- [ ] T006 [P] Instalar o `@auth/prisma-adapter` se ainda não estiver presente (`npm install @auth/prisma-adapter`)
- [ ] T007 [P] Atualizar `src/infrastructure/auth/auth.ts`:
  - Adicionar `PrismaAdapter(prisma)` como adapter do NextAuth
  - Adicionar `GoogleProvider` ao array de `providers` com `allowDangerousEmailAccountLinking: true`
  - **⚠️ CRÍTICO**: Manter `session: { strategy: 'jwt' }` explicitamente no config. Ao adicionar o PrismaAdapter, o Auth.js muda silenciosamente para database sessions, quebrando os callbacks `jwt()` e `session()`. Forçar JWT garante o comportamento atual.
  - Atualizar o callback `jwt` para incluir `apartmentId` no token (ler do banco via `token.sub` no primeiro login)
  - Atualizar o callback `session` para expor `apartmentId` na sessão do cliente via `session.user.apartmentId = token.apartmentId`

**Checkpoint**: Login com Google redireciona, autentica e cria/vincula a conta no banco.

---

## Phase 3: Middleware — Proteção para Onboarding

**Purpose**: Interceptar usuários autenticados sem apartamento e mandá-los para `/onboarding`.

- [ ] T008 [P] Atualizar `src/infrastructure/auth/auth.config.ts`: adicionar checagem de `apartmentId` nulo no callback `authorized`. Se autenticado mas sem `apartmentId`, redirecionar para `/onboarding`. Proteger `/onboarding` para bloquear usuários não autenticados.

**Checkpoint**: Um usuário recém-vindo do Google (sem apartamento) é bloqueado do `/dashboard` e vai direto para `/onboarding`.

---

## Phase 4: Onboarding Flow (User Story 2)

**Purpose**: Criar o fluxo completo de preenchimento de apartamento para novos usuários Google.

### Tests para o Onboarding ⚠️
> **NOTE: Escrever estes testes PRIMEIRO, garantir que FALHAM antes da implementação**
- [ ] T009 [P] Criar testes Vitest para o use-case de `CompleteOnboarding` em `tests/unit/core/use-cases/complete-onboarding.test.ts`

### Implementação do Onboarding
- [ ] T010 [P] Criar Zod schema para o formulário de onboarding em `src/actions/schemas/onboarding-schema.ts`
- [ ] T011 [P] Implementar o use-case `CompleteOnboarding` em `src/core/use-cases/complete-onboarding.ts` (recebe `userId` e `apartmentId`, persiste no DB)
- [ ] T012 Implementar método `updateApartment` no `src/infrastructure/database/resident-repository.ts`
- [ ] T013 [P] Implementar Server Action `completeOnboardingAction` em `src/actions/onboarding-actions.ts`
- [ ] T014 [P] Criar a página de Onboarding em `src/app/(onboarding)/onboarding/page.tsx` com:
  - Formulário com campo de número do apartamento (numérico)
  - Botão "Confirmar" que dispara `completeOnboardingAction`
  - Botão "Sair" que chama `signOut()` e redireciona para `/login`
  - Design seguindo o padrão visual existente (glassmorphism, hero-gradient)

**Checkpoint**: Novo usuário Google consegue preencher o apartamento e acessar o dashboard com sucesso.

---

## Phase 5: UI — Botão de Login com Google

**Purpose**: Adicionar o botão "Continuar com o Google" na tela de login/registro existente.

- [ ] T015 [P] Criar componente `src/components/auth/GoogleSignInButton.tsx` (botão com ícone do Google, chama `signIn("google")`)
- [ ] T016 [P] Atualizar `src/app/(public)/login/page.tsx`:
  - Adicionar divisor visual "ou continue com" entre o formulário e o botão social
  - Adicionar o componente `GoogleSignInButton` tanto na aba de Login quanto na de Registro

**Checkpoint**: O botão "Continuar com o Google" aparece na tela de login e funciona ponta a ponta.

---

## Phase 6: Polish & Validation

**Purpose**: Garantir a integridade do fluxo e a experiência visual.

- [ ] T017 Validar Account Linking manualmente: criar conta com e-mail/senha → fazer logout → logar com Google do mesmo e-mail → confirmar que é a mesma conta (sem duplicata)
- [ ] T018 Validar fluxo de novo usuário manualmente: logar com Google de um e-mail novo → confirmar redirect para `/onboarding` → preencher apartamento → confirmar acesso ao `/dashboard`
- [ ] T019 Validar que usuário no `/onboarding` consegue clicar em "Sair" e encerrar a sessão corretamente
- [ ] T020 Atualizar `prisma/seed.ts` se necessário para garantir compatibilidade com os novos campos opcionais

---

## Dependencies & Execution Order

### Dependências entre Phases
- **Phase 1 (DB)**: Sem dependências — começa imediatamente. **Bloqueia tudo.**
- **Phase 2 (Auth.js)**: Depende da Phase 1 (Prisma schema e Adapter).
- **Phase 3 (Middleware)**: Depende da Phase 2 (token de sessão com `apartmentId`).
- **Phase 4 (Onboarding)**: Depende da Phase 3 (middleware de proteção).
- **Phase 5 (UI Button)**: Depende da Phase 2. Pode correr em paralelo com Phase 4.
- **Phase 6 (Polish)**: Depende de todas as phases anteriores.

### Dentro de cada Phase
- Testes Vitest DEVEM ser escritos e FALHAR antes da implementação (TDD).
- Entities/Schemas → Use-cases → Server Actions → UI Pages.
