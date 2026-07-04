---
description: "Task list for Reviews & Ratings implementation"
---

# Tasks: Reviews & Ratings

**Input**: Design documents from `/specs/002-reviews-ratings/`

**Prerequisites**: plan.md, spec.md, data-model.md

## Phase 1: Setup & Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T001 Setup Prisma database schema for `Review` model and migrations (`prisma/schema.prisma`)
- [ ] T002 Update `src/core/entities/listing.ts` to include `ratingAverage` and `reviewCount`
- [ ] T003 Create base `Review` entity in `src/core/entities/review.ts`
- [ ] T004 Create `Review` Zod schemas in `src/actions/schemas/review.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 2: User Story 1 - Avaliar um serviço (Priority: P1) 🎯 MVP

**Goal**: Permitir que morador autenticado dê nota (1 a 5) e comentário sobre serviço (sem auto-avaliação, apenas 1 por serviço).

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create Prisma Review repository in `src/infrastructure/database/review-repository.ts` (create, update, delete operations)
- [ ] T006 [US1] Implement Create/Update/Delete Review use cases in `src/core/use-cases/reviews/`
- [ ] T007 [US1] Implement Server Actions for handling reviews in `src/actions/reviews.ts`
- [ ] T008 [P] [US1] Create UI component `StarRating` in `src/components/reviews/StarRating.tsx`
- [ ] T009 [US1] Create `ReviewForm` component using `react-hook-form` and `zod` in `src/components/reviews/ReviewForm.tsx`
- [ ] T010 [US1] Integrate `ReviewForm` on the service details page to allow users to post/update/delete reviews.

**Checkpoint**: At this point, User Story 1 should be fully functional (creation, update and deletion).

---

## Phase 3: User Story 2 - Visualizar a reputação de um serviço (Priority: P2)

**Goal**: Visualizar a nota média de um serviço e total de avaliações no `ListingCard`.

### Implementation for User Story 2

- [ ] T011 [US2] Update `Listing` repository (`src/infrastructure/database/listing-repository.ts`) to calculate and include average rating and review count when fetching listings.
- [ ] T012 [US2] Update Server Actions that fetch listings (e.g. `src/actions/listings.ts`) to return the updated Listing entity.
- [ ] T013 [US2] Update `src/components/listings/ListingCard.tsx` (or similar) to display the average rating and review count.

**Checkpoint**: Listing Cards show the average rating and number of reviews.

---

## Phase 4: User Story 3 - Ler avaliações detalhadas (Priority: P3)

**Goal**: Clicar nas estrelas de um serviço para ler os comentários detalhados deixados por outros vizinhos.

### Implementation for User Story 3

- [ ] T014 [US3] Implement `ListReviews` use case in `src/core/use-cases/reviews/list-reviews.ts`
- [ ] T015 [US3] Implement Server Action to fetch reviews for a specific service in `src/actions/reviews.ts`
- [ ] T016 [US3] Create `ReviewList` component in `src/components/reviews/ReviewList.tsx` to render individual reviews.
- [ ] T017 [US3] Integrate `ReviewList` in a modal ou na página de detalhes do serviço.

**Checkpoint**: Users can read the detailed reviews.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T018 Run `prisma db push` (or generate migrations) and update seed data in `prisma/seed.ts` se necessário.
- [ ] T019 Apply CSS styling (`.glass`, `.brand-gradient`) for Review components per Constitution guidelines.
- [ ] T020 Run tests (if applicable) and manually verify Edge Cases (e.g. Cascade deletion).
