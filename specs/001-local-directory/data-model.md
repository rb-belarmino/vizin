# Data Model: Vizin Marketplace

## Entities

### User (Resident)
Represents a condominium resident who can access the private dashboard and manage listings.

- **Fields**:
  - `id`: UUID (Primary Key)
  - `fullName`: String (Required)
  - `email`: String (Required, Unique, Valid Email)
  - `passwordHash`: String (Required)
  - `apartmentId`: Integer (Required, Strictly Numerical)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - `listings`: 1-to-Many with `ServiceListing`
- **Validation**:
  - `apartmentId` must be >= 1.
  - Multiple users can share the same `apartmentId` (Clarification decision: Trust closed community nature).

### ServiceListing
Represents a service offered by a resident to the condominium.

- **Fields**:
  - `id`: UUID (Primary Key)
  - `title`: String (Required, Max 100 chars)
  - `description`: Text (Required, Max 500 chars)
  - `categoryId`: Enum (Gastronomia, Reformas, Aulas, Beleza, Saúde, Outros)
  - `portfolioImageUrl`: String (Required, Valid URL from UploadThing)
  - `portfolioImageKey`: String (Required, UploadThing File Key for deletion tracking)
  - `priceBaseline`: String (Optional, e.g., "A partir de R$ 50")
  - `whatsappNumber`: String (Optional, Clean numeric only, predefined structural field)
  - `instagramHandle`: String (Optional, Without '@', predefined structural field)
  - `visibilityStatus`: Enum (Public, Hidden) - Default: Public
  - `providerId`: UUID (Foreign Key to User)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - `provider`: Many-to-1 with `User`
- **Validation**:
  - At least one contact field (`whatsappNumber` or `instagramHandle`) must be provided.
  - Image key is strictly required to satisfy UploadThing garbage collection requirements.

## State Transitions
- **Listing Creation**: Draft -> Public
- **Listing Visibility Toggle**: Public <-> Hidden
- **Listing Deletion**: Deletes DB row AND triggers UploadThing asset deletion via API (Parity constraint).
