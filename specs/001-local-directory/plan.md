# Implementation Plan: Vizin Marketplace

**Branch**: `001-local-directory` | **Date**: 2026-07-07 | **Spec**: `/specs/001-local-directory/spec.md`

**Input**: Feature specification from `/specs/001-local-directory/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Develop Vizin Marketplace: a local directory and marketplace for condominium residents. It includes a public catalog of services with search/filter capabilities, a private provider dashboard for managing listings and uploading images (with privacy controls allowing providers to hide their apartment numbers and responsive UX feedback para operações assíncronas com modais amplos), and a user profile management system with a secure password recovery flow. The technical approach strictly adheres to Clean Architecture using Next.js 16 App Router, Auth.js v5 on Edge, Prisma ORM, UploadThing, and Resend for transactional emails.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: Next.js 16 (App Router), Auth.js v5, Prisma ORM, Zod, Tailwind CSS, Radix UI, UploadThing, Resend, React Email

**Storage**: NeonDB (PostgreSQL) and UploadThing (media assets)

**Testing**: Vitest (TDD Mandatory)

**Target Platform**: Web Browser / Vercel Edge Runtime

**Project Type**: Web Application

**Performance Goals**: < 2s latency for search/filter actions

**Constraints**: Strict Clean Architecture (domain isolation), Edge Runtime compatibility for middleware/auth, 1:1 parity between DB and UploadThing.

**Scale/Scope**: Single-tower condominium residents

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Clean & Modular Architecture**: Business logic is in pure TypeScript domain entities/use-cases.
- [x] **Unified Full-Stack**: Next.js 16 App Router with Server Actions as thin edge controllers using Zod.
- [x] **TDD**: Automated unit tests in Vitest are planned prior to implementation.
- [x] **Safe Cryptography & Edge**: Auth.js v5 Split Config pattern, isolating Prisma/bcryptjs from Edge.
- [x] **Data Sync**: UploadThing parity included in requirements.
- [x] **Security**: Plaintext logging prohibited; dashboard is gated.

## Project Structure

### Documentation (this feature)

```text
specs/001-local-directory/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/                 # Next.js 16 App Router UI & API routes
│   ├── (public)/        # Public catalog pages
│   ├── (private)/       # Protected dashboard pages
│   └── api/             # Webhooks (e.g., UploadThing)
├── components/          # React components (Radix UI + Tailwind)
├── core/                # Pure TypeScript domain logic (Clean Architecture)
│   ├── entities/        # Business models (Resident, Listing)
│   └── use-cases/       # Application logic
├── infrastructure/      # External adapters
│   ├── database/        # Prisma Client & Repositories
│   ├── storage/         # UploadThing SDK integration
│   └── auth/            # Auth.js config (Split Config pattern)
└── actions/             # Server Actions (thin edge controllers + Zod validation)

tests/
├── unit/                # Vitest core domain tests
└── integration/         # Edge/DB integration tests
```

**Structure Decision**: A custom Web application structure separating Next.js (`app/`, `components/`, `actions/`) from pure business logic (`core/`) and external dependencies (`infrastructure/`) to strictly satisfy the Clean Architecture and Edge Compatibility constraints of the Constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
