---
description: "Task list for Vizin Marketplace implementation"
---

# Tasks: Vizin Marketplace

**Input**: Design documents from `/specs/001-local-directory/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md

**Tests**: TDD is non-negotiable per the Constitution. Tests MUST be written in Vitest before core use-cases or Server Actions are implemented.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 Initialize Next.js 16 project with Tailwind CSS and Radix UI
- [x] T002 Create project structure (app, components, core, infrastructure, actions, tests) per implementation plan
- [x] T003 [P] Configure Vitest for TDD execution

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T004 Setup Prisma ORM and define NeonDB schema in `prisma/schema.prisma`
- [x] T005 [P] Implement UploadThing base config in `src/infrastructure/storage/uploadthing.ts` and `src/app/api/uploadthing/route.ts`
- [x] T006 [P] Implement Auth.js v5 split config in `src/infrastructure/auth/auth.config.ts` and `src/infrastructure/auth/auth.ts`
- [x] T007 Setup middleware for edge Auth.js route protection in `src/middleware.ts`

**Checkpoint**: Foundation ready - database, storage, and edge auth are wired.

---

## Phase 3: User Story 1 - Public Service Catalog (Priority: P1)

**Goal**: Display a dynamic, searchable grid of public services on the home page for demand-side users.

**Independent Test**: Can view, search, and filter mocked/seeded listings on `/` without logging in.

### Tests for User Story 1 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
- [x] T008 [P] [US1] Create Vitest tests for fetching/filtering public listings in `tests/unit/core/use-cases/get-public-listings.test.ts`

### Implementation for User Story 1
- [x] T009 [P] [US1] Create Listing entity model in `src/core/entities/listing.ts`
- [x] T010 [US1] Implement `GetPublicListings` pure domain use-case in `src/core/use-cases/get-public-listings.ts`
- [x] T011 [US1] Implement Prisma repository method for public listings in `src/infrastructure/database/listing-repository.ts`
- [x] T012 [P] [US1] Create Zod schemas for search/filter in `src/actions/schemas/catalog-schema.ts`
- [x] T013 [US1] Implement Server Action for fetching/filtering in `src/actions/catalog-actions.ts`
- [x] T014 [P] [US1] Build category pill components in `src/components/catalog/CategoryPills.tsx`
- [x] T015 [P] [US1] Build listing card component in `src/components/catalog/ListingCard.tsx`
- [x] T016 [US1] Implement Home page UI with search and grid in `src/app/(public)/page.tsx`

**Checkpoint**: Public catalog is functional with dummy or seeded database records.

---

## Phase 4: User Story 2 - Provider Dashboard (Priority: P1)

**Goal**: Allow residents to securely log in, create, edit, and delete their own service listings with image upload capability.

**Independent Test**: Can register, log in, view own isolated grid, upload image, and delete listing (triggering UploadThing asset purge).

### Tests for User Story 2 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**
- [x] T017 [P] [US2] Create Vitest tests for resident auth and listing CRUD in `tests/unit/core/use-cases/manage-listings.test.ts`

### Implementation for User Story 2
- [x] T018 [P] [US2] Create Resident entity model in `src/core/entities/resident.ts`
- [x] T019 [US2] Implement Prisma repository methods for resident and private listings in `src/infrastructure/database/resident-repository.ts`
- [x] T020 [P] [US2] Create Zod schemas for Auth (Register/Login) in `src/actions/schemas/auth-schema.ts`
- [x] T021 [P] [US2] Create Zod schemas for Listing Management in `src/actions/schemas/listing-schema.ts`
- [x] T022 [US2] Implement Auth Server Actions in `src/actions/auth-actions.ts`
- [x] T023 [US2] Implement Listing CRUD Server Actions in `src/actions/listing-actions.ts`
- [x] T024 [US2] Implement login/register pages in `src/app/(public)/login/page.tsx`
- [x] T025 [US2] Implement dashboard layout and access guard in `src/app/(private)/dashboard/layout.tsx`
- [x] T026 [P] [US2] Build multi-input creation form with UploadThing button in `src/components/dashboard/ListingForm.tsx`
- [x] T027 [US2] Implement dashboard private grid in `src/app/(private)/dashboard/page.tsx`
- [x] T028 [US2] Hook up UploadThing webhook to trigger physical asset deletion on DB purge in `src/app/api/uploadthing/core.ts`

**Checkpoint**: Provider dashboard is fully functional with 1:1 database and storage parity.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final UI improvements and end-to-end validation.

- [x] T029 [P] Polish styling with Tailwind and Radix UI in `src/app/globals.css`
- [x] T030 [P] Implement empty state fallback for zero search results (UX)
- [x] T031 Execute `quickstart.md` validation manually
- [x] T032 Create seed data in `prisma/seed.ts` with 4 demo users and 8 realistic listings across all categories (run: `npm run db:seed`)
- [x] T033 [P] Implement Web Share API (mobile drawer) with clipboard fallback on `ListingCard.tsx` (FR-005)
- [x] T034 [P] Add visibility toggle (Public/Hidden) button per listing in dashboard via `toggleVisibilityAction`
- [x] T035 [P] Redesign premium UI: indigo/blue brand color system, hero gradient, glassmorphism login, animated cards, emoji category pills, provider info on cards
- [x] T036 [P] Implement edit listing modal (`EditListingModal.tsx`) with pre-populated form, image preview with hover-to-replace, and `updateListingAction` integration

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3 & 4)**: Both depend on Foundational phase completion. They can be executed in parallel by different developers, or sequentially.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Within Each User Story
- Vitest tests MUST be written and FAIL before implementation (TDD).
- Entities/Models before Use-cases.
- Use-cases before Server Actions.
- Server Actions before UI Pages.

### Parallel Opportunities
- Zod schemas, UI components, and unit tests within a user story can be developed in parallel by different developers.
- `T005` (UploadThing config) and `T006` (Auth.js config) in Foundational Phase can be implemented concurrently.
