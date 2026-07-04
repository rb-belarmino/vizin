# Data Model: Reviews & Ratings

## Prisma Entities

### Review
- `id`: String (UUID) - Primary Key
- `rating`: Int - Required, 1 to 5
- `comment`: String - Optional, text provided by the user
- `authorId`: String - Foreign Key to Resident (User)
- `serviceListingId`: String - Foreign Key to ServiceListing
- `createdAt`: DateTime - Auto-generated timestamp
- `updatedAt`: DateTime - Auto-updated timestamp

## Relationships & Constraints

- **Foreign Keys**: 
  - `Review` -> `author` (Resident)
  - `Review` -> `serviceListing` (ServiceListing)
- **Referential Actions**: 
  - `onDelete: Cascade` applied to `serviceListing` (when a service is deleted, its reviews are automatically purged).
- **Constraints**: 
  - `@@unique([authorId, serviceListingId])`: Ensures a user can only leave one review per service.

## Domain Entities (Clean Architecture)

- **Review Entity**: Pure TypeScript class/interface representing the Review model, isolated from Prisma, located in `src/core/entities/review.ts`.
- **Listing Entity Update**: Requires updating `src/core/entities/listing.ts` to include `ratingAverage` (Float) and `reviewCount` (Int) for frontend display purposes.
