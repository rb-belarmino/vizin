# Research: Reviews & Ratings

## Decisions

- **Decision:** Prisma for Database Schema with Cascade Delete.
  - **Rationale:** Ensures data integrity by automatically removing reviews when a service is deleted (Cascade) and enforcing a unique constraint (userId + serviceId).
  - **Alternatives considered:** Soft delete (rejected in clarification phase).

- **Decision:** Clean Architecture (Domain isolation).
  - **Rationale:** Adheres to project constitution. Use Cases handle business logic (e.g., verifying user isn't the service provider) separated from Next.js APIs.
  - **Alternatives considered:** Fat Server Actions (rejected due to Constitution rules).

- **Decision:** Server Actions + Zod.
  - **Rationale:** Provides strong type safety and server-side validation (rating 1-5, optional text) for edge controllers.

- **Decision:** UI Components (StarRating, ListingCard, ReviewForm).
  - **Rationale:** React-hook-form + zodResolver for client validation. Use of OKLCH variables (no hex values) to strictly follow Vizin styling guidelines.
