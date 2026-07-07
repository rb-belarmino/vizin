# Implementation Plan: 001-local-directory

## Goal
Establish the foundational directory architecture allowing users to view, search, create, edit, and soft-delete service listings, while supporting image uploads and secure password recovery flows.

## Summary
Develop Vizin Marketplace: a local directory and marketplace for condominium residents. It includes a public catalog of services with search/filter capabilities, a private provider dashboard for managing listings and uploading images (with privacy controls allowing providers to hide their apartment numbers and responsive UX feedback para operações assíncronas com modais amplos), and a user profile management system with a secure password recovery flow. The technical approach strictly adheres to Clean Architecture using Next.js 16 App Router, Auth.js v5 on Edge, Prisma ORM, UploadThing, and Resend for transactional emails.

## Technical Context
- Next.js 16 (App Router)
- React 19 Server Components
- Clean Architecture (Core/Entities, UseCases, Actions, UI Components)
- Prisma (Postgres)
- TailwindCSS (Standard tokens)
- UploadThing (Image storage)

## Architecture Map
- `app/(public)/page.tsx` - Search and list public services
- `app/(private)/dashboard/page.tsx` - Inventory of user's registered services
- `app/(private)/dashboard/novo/page.tsx` - Dedicated route for creating a new service
- `components/dashboard/ListingForm.tsx` - Client component for creating a service
- `components/dashboard/EditListingModal.tsx` - Client modal for editing a service
- `actions/listing-actions.ts` - Server actions (Ports) bridging UI and Core
- `core/use-cases/create-listing.ts` - Pure business logic
- `infrastructure/database/listing-repository.ts` - Prisma DB adapter

## Components & Data Flow
1. **Catalog (Public)**: Server component fetches `public` listings via `GetListingsUseCase` and renders `ListingCard` components grid. Search uses URL searchParams mapped to Prisma where clauses.
2. **Dashboard (Private)**: Server component verifies `auth()` session, fetches user's `all` listings. Includes `ListingForm` (uses `react-hook-form` and UploadThing dropzone) and `EditListingModal`.
3. **Upload Workflow**: UploadThing handles file transfer directly to S3. Returns URL which is saved to Prisma via `CreateListingUseCase`.
