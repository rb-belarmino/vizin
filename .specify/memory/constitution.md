<!--
Sync Impact Report:
- Version change: initial → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Clean & Modular Architecture
  - [PRINCIPLE_2_NAME] → II. Unified Full-Stack Strategy
  - [PRINCIPLE_3_NAME] → III. Test-Driven Development (TDD)
  - [PRINCIPLE_4_NAME] → IV. Safe Cryptography & Edge Compatibility
  - [PRINCIPLE_5_NAME] → V. Data Synchronization & Garbage Collection
- Added sections: Architectural Constraints & Security
- Removed sections: [SECTION_3_NAME]
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ verified no changes needed)
  - .specify/templates/spec-template.md (✅ verified no changes needed)
  - .specify/templates/tasks-template.md (✅ verified no changes needed)
- Follow-up TODOs: None
-->

# Vizin Constitution

## Core Principles

### I. Clean & Modular Architecture

Every technical implementation must respect the boundaries of Clean Architecture. Business logic must live purely inside TypeScript domain entities and use-cases, decoupling them entirely from Next.js, Prisma ORM, or any external vendor library.

### II. Unified Full-Stack Strategy

Next.js 16 (App Router) is the sovereign framework for both client and server computing. Server Actions must serve strictly as thin edge controllers to validate ingress payloads with Zod and delegate processing directly to pure domain use-cases.

### III. Test-Driven Development (TDD)

Writing automated unit tests using Vitest is a non-negotiable prerequisite prior to implementing core business handlers or Server Actions. The Red-Green-Refactor development cycle must be stringently enforced by isolation and clean mock boundaries.

### IV. Safe Cryptography & Edge Compatibility

Authentication relies on Auth.js v5 using a Split Config pattern. Heavily-coupled operations (e.g., Prisma Client, bcryptjs) must remain isolated from the lightweight middleware validation scope to satisfy Vercel Edge Runtime prerequisites.

### V. Data Synchronization & Garbage Collection

Persisted media hosted via UploadThing storage must maintain precise parity with our serverless relational database state. Any event modifying or purging a post containing images must automatically trigger storage-level deletions of orphaned assets.

## Architectural Constraints & Security

### Homologated Stack

- Framework: Next.js 16 (App Router, Server Actions)
- Database: NeonDB (PostgreSQL) interfaced through Prisma ORM
- Auth: Auth.js v5 (NextAuth.js) via Credentials Provider
- UI: Tailwind CSS + Radix UI molecules cloned from shadcn/ui
- Storage: UploadThing SDK

### Security Parameters

- Plaintext logging of user passwords, payload tokens, or structural hashes via system output hooks (console.log) is strictly prohibited.
- User data visibility is gated entirely by session contexts; non-authenticated clients are barred from traversing restricted boundaries.

## Governance

- This document holds constitutional precedence over any ad-hoc code assembly or artificial intelligence generation.
- Technical agents must cross-verify component schemas against these directives during phase checkpoints.

**Version**: 1.0.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-07-03
