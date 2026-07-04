# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Develop the Reviews & Ratings feature for the Vizin Marketplace, allowing authenticated residents to evaluate services (1 to 5 stars) and optionally leave comments. This establishes community trust and service reputation. The implementation will strictly follow Clean Architecture principles, isolating domain logic (Review entities and use cases) from Next.js Server Actions, utilizing Prisma for data persistence (with cascade deletes), and Zod for robust validation.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: Next.js 16 (App Router), Prisma ORM, Zod, React Hook Form, Tailwind CSS, Radix UI

**Storage**: NeonDB (PostgreSQL)

**Testing**: Vitest (TDD Mandatory)

**Target Platform**: Web Browser / Vercel Edge Runtime

**Project Type**: Web Application

**Performance Goals**: < 100ms latency for star average calculation and review submission

**Constraints**: Strict Clean Architecture (domain isolation), Edge Runtime compatibility, Zod validation for Server Actions, OKLCH variables for styling (no hex in Tailwind).

**Scale/Scope**: Single-tower condominium residents

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Clean & Modular Architecture**: Review domain logic is isolated in `src/core/` (entities and use cases).
- [x] **Unified Full-Stack**: Server actions inside `src/actions/` act as thin edge controllers with Zod schema validation.
- [x] **TDD**: Tests planned for Use Cases ensuring isolation and correct business rules (no self-review, one review per user).
- [x] **Security**: UI/UX adheres strictly to styling variables without hex codes; Server Actions gate operations to authenticated users only.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma        # Addition of Review model and relations

src/
├── app/
│   └── (public)/        # UI integration on listing details page
├── components/          
│   └── reviews/         # StarRating, ReviewForm, ListingCard updates
├── core/                
│   ├── entities/        # Review.ts
│   └── use-cases/       # CreateReview, UpdateReview, DeleteReview, ListReviews
├── infrastructure/      
│   └── database/        # Prisma review repositories
└── actions/             
    ├── reviews.ts       # Server Actions for handling reviews
    └── schemas/         
        └── review.ts    # Zod schemas for payload validation
```

**Structure Decision**: Integrated seamlessly into the existing Next.js web application structure following Clean Architecture principles. Domain logic isolated in `core`, with Next.js serving as the presentation and entry layer via `actions` and `components`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations - Architecture complies with Constitution)*
