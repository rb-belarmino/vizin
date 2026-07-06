---
description: "Task list template for feature implementation"
---

# Tasks: Uploadthing Integration

**Input**: Design documents from `/specs/003-uploadthing/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [x] T001 Install `uploadthing` and `@uploadthing/react` dependencies
- [x] T002 Add `UPLOADTHING_TOKEN` requirement to the environment configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update database schema in `prisma/schema.prisma` to add `portfolioImageUrl` and `portfolioImageKey` (optional string fields) to `ServiceListing`
- [x] T004 Generate and apply Prisma migrations for the schema changes

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Secure Image Upload (Priority: P1) 🎯 MVP

**Goal**: As an authenticated service provider, I want to upload a portfolio image when creating or editing my Service Listing.

**Independent Test**: Can be fully tested by attempting an image upload through the UI as an authenticated user, verifying the image is stored in UploadThing and its URL/Key is returned.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create UploadThing File Router in `src/app/api/uploadthing/core.ts` with Auth.js session validation and 4MB image limit
- [x] T006 [P] [US1] Expose Next.js API route in `src/app/api/uploadthing/route.ts`
- [x] T007 [US1] Implement custom `ServiceImageDropzone.tsx` in `src/components/upload/ServiceImageDropzone.tsx` using `@uploadthing/react` `<UploadDropzone>`
- [x] T008 [US1] Integrate `ServiceImageDropzone` into the Create/Edit Service Listing form component

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Image Garbage Collection (Priority: P1)

**Goal**: As a system maintainer, I want images deleted from UploadThing whenever their associated ServiceListing is deleted or the image is replaced.

**Independent Test**: Delete a ServiceListing and verify via the UploadThing API that the file no longer exists. Trigger the cron job to verify orphan cleanup.

### Implementation for User Story 2

- [x] T008.1 [US2] Write automated unit tests (TDD) with Vitest for the domain logic `deleteListing.ts` ensuring `UTApi.deleteFiles` is called appropriately
- [x] T008.2 [US2] Write automated unit tests (TDD) with Vitest for the Server Action `delete.ts` to ensure edge controller delegates correctly
- [x] T009 [P] [US2] Update domain logic in `src/core/use-cases/listings/deleteListing.ts` to call `UTApi.deleteFiles` (non-blocking)
- [x] T010 [US2] Update Server Action in `src/actions/service-listings/delete.ts` to use the updated domain logic
- [x] T011 [US2] Implement daily Vercel Cron Job in `src/app/api/cron/cleanup-images/route.ts` to identify and delete orphaned files

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 Validate error handling (e.g., file > 4MB) displays properly in the UI
- [x] T013 Run `quickstart.md` end-to-end validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

### Implementation Strategy (MVP First)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Complete Phase 4: User Story 2
