---
description: "Checklist de tarefas granulares para o Sistema de Avaliações (Reviews)"
---

# Tasks: Sistema de Avaliações e Estrelas

**Input**: `specs/002-reviews-ratings/plan.md`, `specs/002-reviews-ratings/data-model.md`

## Fase 1: Banco de Dados e Infraestrutura

**Objetivo**: Modificar o Prisma, aplicar as migrations e preparar a camada de acesso a dados (Repositórios).

- [ ] **T101**: Atualizar `prisma/schema.prisma` adicionando o modelo `Review` com índice `@@index([listingId])` e a restrição de unicidade `@@unique([authorId, listingId])`.
- [ ] **T102**: Adicionar as relações recíprocas `reviews Review[]` nos modelos `User` e `ServiceListing`.
- [ ] **T103**: Executar a sincronização do banco com o comando `npx prisma db push` (e `generate`).
- [ ] **T104**: Criar `src/infrastructure/database/review-repository.ts` contendo:
  - `upsertReview(data)`: Cria ou atualiza a avaliação se já existir.
  - `getReviewsByListingId(listingId)`: Busca a lista completa de avaliações ordenadas pelas mais recentes.
- [ ] **T105**: Atualizar o método `getPublicListings` no `listing-repository.ts` para incluir a média de notas (`_avg`) e o total de avaliações (`_count`).

---

## Fase 2: Regras de Negócio e Server Actions

**Objetivo**: Criar a ponte segura entre o Banco de Dados e o Frontend, validando as regras do `spec.md`.

- [ ] **T106**: Criar o schema de validação no Zod em `src/actions/schemas/review-schema.ts` (garantindo nota de 1 a 5 e sanitizando comentários longos).
- [ ] **T107**: Criar a Server Action `createReviewAction(listingId, data)` em `src/actions/review-actions.ts`.
  - *Regra*: Deve verificar via Auth.js se o usuário está logado.
  - *Regra (FR-002)*: Deve falhar imediatamente se o `providerId` do anúncio for igual ao ID do usuário autenticado.
- [ ] **T108**: Criar a Server Action `getListingReviewsAction(listingId)` em `src/actions/review-actions.ts` para buscar a lista de detalhes (necessário para o modal).

---

## Fase 3: Componentes de UI Base

**Objetivo**: Criar os tijolos visuais reutilizáveis do frontend (Design System).

- [ ] **T109**: Construir o componente de exibição `src/components/catalog/StarRating.tsx` (mostra estrelas pintadas baseadas na fração da média).
- [ ] **T110**: Construir o componente interativo `src/components/catalog/StarRatingInput.tsx` (permite ao usuário clicar/hover para escolher de 1 a 5).
- [ ] **T111**: Construir o componente formulário `src/components/catalog/ReviewForm.tsx` utilizando React Hook Form, o Zod resolver, e conectando com o `createReviewAction`.

---

## Fase 4: Integração Final (UX/Telas)

**Objetivo**: Costurar tudo para o usuário final no Catálogo e possibilitar os testes.

- [ ] **T112**: Atualizar o `ListingCard.tsx` no catálogo (`src/app/(public)/page.tsx`) para renderizar o `StarRating` e o `(total reviews)` logo abaixo do título ou da categoria.
- [ ] **T113**: Criar o componente `ReviewsModal.tsx` (Glassmorphism), que abre ao clicar no card de um serviço.
- [ ] **T114**: Dentro do `ReviewsModal.tsx`, exibir:
  - Lista das avaliações deixadas (Nome, Data, Estrelas, Comentário).
  - O `ReviewForm.tsx` logo acima (condicionado: não mostrar se o usuário for deslogado ou se for o dono do serviço).
- [ ] **T115**: Atualizar o arquivo `prisma/seed.ts` para injetar algumas avaliações mockadas de usuários demo (ex: Ana avaliando o serviço do Carlos) para testes visuais imediatos.
