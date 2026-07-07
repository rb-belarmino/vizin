# Data Model: Vizin Marketplace

## Entities

### User (Resident)
Represents a condominium resident who can access the private dashboard and manage listings.

- **Fields**:
  - `id`: UUID (Primary Key)
  - `fullName`: String (Required)
  - `email`: String (Required, Unique, Valid Email)
  - `passwordHash`: String (**Optional** — nulo para usuários que autenticam via Google OAuth)
  - `apartmentId`: Integer (**Optional** — nulo até o usuário completar o Onboarding; preenchimento obrigatório pelo fluxo da aplicação)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - `listings`: 1-to-Many with `ServiceListing`
  - `passwordResetTokens`: 1-to-Many with `PasswordResetToken`
  - `accounts`: 1-to-Many with `Account` (tokens OAuth)
- **Validation**:
  - `apartmentId`, quando presente, deve ser >= 1.
  - Múltiplos usuários podem compartilhar o mesmo `apartmentId` (decisão de clarificação: confiança na natureza fechada da comunidade).
  - Um usuário com `apartmentId` nulo está em estado de **Onboarding Pendente** e não pode acessar rotas privadas.

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
  - `showApartment`: Boolean (Required) - Default: true
  - `providerId`: UUID (Foreign Key to User)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
- **Relationships**:
  - `provider`: Many-to-1 with `User`
- **Validation**:
  - At least one contact field (`whatsappNumber` or `instagramHandle`) must be provided.
  - Image key is strictly required to satisfy UploadThing garbage collection requirements.
  - `showApartment` controls if the provider's apartment number is visible to the public.

### Account (OAuth)
Represents a linked OAuth provider account for a user (ex: Google). Gerenciado automaticamente pelo PrismaAdapter do Auth.js.

- **Fields**:
  - `id`: UUID (Primary Key)
  - `userId`: UUID (Foreign Key to User)
  - `type`: String (ex: `oauth`)
  - `provider`: String (ex: `google`)
  - `providerAccountId`: String (ID único do usuário no provedor externo)
  - `access_token`: String (Optional)
  - `refresh_token`: String (Optional)
  - `expires_at`: Integer (Optional)
  - `token_type`: String (Optional)
  - `scope`: String (Optional)
  - `id_token`: String (Optional)
- **Relationships**:
  - `user`: Many-to-1 with `User` (`onDelete: Cascade`)
- **Constraints**:
  - `@@unique([provider, providerAccountId])`: Um par provider+ID é único no sistema.

---

### PasswordResetToken
Represents a secure, short-lived token used for recovering access to a user account.

- **Fields**:
  - `id`: UUID (Primary Key)
  - `token`: String (Required, Unique, Securely generated)
  - `expiresAt`: DateTime (Required, Future date/time for expiration)
  - `userId`: UUID (Foreign Key to User)
  - `createdAt`: DateTime
- **Relationships**:
  - `user`: Many-to-1 with `User`
- **Validation**:
  - `token` must be cryptographically secure.
  - `expiresAt` should typically be set to 1-2 hours after creation.
  - Aplicável apenas a usuários com `passwordHash` definido (não aplicável a usuários exclusivamente OAuth).

## State Transitions
- **Listing Creation**: Draft -> Public
- **Listing Visibility Toggle**: Public <-> Hidden
- **Listing Deletion**: Deletes DB row AND triggers UploadThing asset deletion via API (Parity constraint).
- **Password Recovery**: Token Generated (Pending) -> Token Used (Consumed/Deleted) or Expired.
