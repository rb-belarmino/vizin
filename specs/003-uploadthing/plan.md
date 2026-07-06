# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript (Next.js 16 App Router)

**Primary Dependencies**: `uploadthing`, `@uploadthing/react`, `next-auth` (Auth.js v5)

**Storage**: UploadThing (Media), NeonDB/PostgreSQL (Relational Data)

**Testing**: Vitest (Unit Tests)

**Target Platform**: Vercel (Edge & Node Runtimes)

**Project Type**: Full-stack web application

**Performance Goals**: Fast uploads (< 2s for 4MB), instant UI feedback.

**Constraints**: Image max size 4MB. Auth required for all uploads.

**Scale/Scope**: Support 1 image per Service Listing.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean & Modular Architecture (Principle I)**: PASS - Uploads handled via Edge-compatible routes and use-cases.
- **Unified Full-Stack Strategy (Principle II)**: PASS - Next.js App Router and Server Actions utilized for deletion.
- **TDD (Principle III)**: PASS - Handlers will be testable in isolation.
- **Safe Cryptography & Edge (Principle IV)**: PASS - Auth.js v5 used for session validation.
- **Data Parity & Garbage Collection (Principle V)**: PASS - Garbage collection explicitly designed (sync deletion + Vercel Cron fallback).

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
### Source Code (repository root)

```text
src/
├── app/
│   └── api/
│       ├── uploadthing/
│       │   ├── core.ts      # File Router
│       │   └── route.ts     # Next.js API Route
│       └── cron/
│           └── cleanup-images/
│               └── route.ts # Vercel Cron Job
├── components/
│   └── upload/
│       └── ServiceImageDropzone.tsx # Custom UI Dropzone
├── actions/
│   └── service-listings/
│       └── delete.ts        # Server Action with UTApi integration
└── core/
    └── use-cases/
        └── listings/
            └── deleteListing.ts # Domain logic
```

**Structure Decision**: Standard Next.js App Router structure with Clean Architecture boundaries (actions -> core/use-cases).
