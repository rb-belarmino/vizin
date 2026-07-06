# Feature Specification: Uploadthing Integration

**Feature Branch**: `[003-uploadthing-integration]`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Projetar a implementacao para o servico do uploadthing"

## Clarifications

### Session 2026-07-06
- Q: Como lidar com falhas na exclusão de imagens no UploadThing para não acumular arquivos órfãos em grande escala? → A: Usar Vercel Cron Job diário (varre o banco buscando imagens sem referência e apaga em lote).
- Q: Qual abordagem de UI será utilizada para o upload de imagens? → A: Opção A - Usar o componente pronto `<UploadDropzone>` do UploadThing (área de drag-and-drop).
- Q: A imagem do portfólio será obrigatória ou opcional ao criar um ServiceListing? → A: Opção B - Opcional (Pode ser salvo sem imagem; o frontend deve exibir um placeholder/fallback visual).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Image Upload for Service Listings (Priority: P1)

As an authenticated service provider, I want to upload a portfolio image when creating or editing my Service Listing so that customers can see my work.

**Why this priority**: Essential for the `ServiceListing` creation process, as portfolio images are a key part of the product offering.

**Independent Test**: Can be fully tested by attempting an image upload through the UI (or a test harness) as an authenticated user, verifying the image is stored in UploadThing and its URL/Key is returned to be saved in the database.

**Acceptance Scenarios**:

1. **Given** an authenticated user creating a listing, **When** they upload a valid image (e.g., < 4MB PNG/JPG), **Then** the image is successfully uploaded to UploadThing and the `portfolioImageUrl` and `portfolioImageKey` are made available to the client.
2. **Given** an unauthenticated visitor, **When** they attempt to upload a file directly to the upload endpoint, **Then** the request is rejected with a 401/403 error.
3. **Given** an authenticated user, **When** they upload a file that exceeds the size limit or is not an image, **Then** UploadThing rejects the upload and returns a validation error.

---

### User Story 2 - Image Garbage Collection (Priority: P1)

As a system maintainer, I want images deleted from UploadThing whenever their associated `ServiceListing` is deleted or the image is replaced, so that we don't accumulate orphaned files (Vizin Constitution Principle V).

**Why this priority**: Crucial for storage cost management and maintaining precise parity between the serverless relational database state and the UploadThing storage state.

**Independent Test**: Can be tested by deleting a `ServiceListing` containing a valid image key, and verifying via the UploadThing API (or dashboard) that the file no longer exists.

**Acceptance Scenarios**:

1. **Given** an existing `ServiceListing` with an uploaded image, **When** the listing is deleted, **Then** the system automatically triggers an API call to UploadThing to delete the asset using the `portfolioImageKey`.
2. **Given** an existing `ServiceListing` with an uploaded image, **When** the user uploads a *new* portfolio image for the same listing, **Then** the old image is deleted from UploadThing to prevent orphans.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST configure an UploadThing File Router (`app/api/uploadthing/core.ts`) supporting image uploads (e.g., `image/jpeg`, `image/png`, `image/webp`).
- **FR-001a**: The frontend MUST utilize the pre-built `@uploadthing/react` `<UploadDropzone>` component to handle drag-and-drop file uploads.
- **FR-002**: System MUST enforce authentication at the UploadThing router level, rejecting any upload requests lacking a valid session.
- **FR-003**: System MUST enforce a maximum file size for image uploads (e.g., 4MB).
- **FR-004**: System MUST provide a server action (e.g., `deleteImageAction(imageKey: string)`) or utilize a domain use-case that interfaces with the UploadThing UTApi to delete files.
- **FR-005**: System MUST automatically invoke the deletion use-case when a `ServiceListing` is purged from the database or when its image is overwritten.

### Edge Cases & Error Handling

- **EC-001**: Se a API do UploadThing falhar ao deletar uma imagem durante a exclusão de um `ServiceListing`, a transação do banco de dados **não** deve ser bloqueada. A imagem órfã será limpa posteriormente.
- **EC-002**: O sistema DEVE implementar um Vercel Cron Job diário para varrer e excluir em lote arquivos órfãos no UploadThing que não possuem mais referência ativa no banco de dados.

### Key Entities

- **ServiceListing**: The primary entity in `prisma/schema.prisma` that stores `portfolioImageUrl` and `portfolioImageKey`. These fields MUST be optional (nullable) as a listing can be created without an image. The frontend will render a visual placeholder when missing.
- **UploadThing API (UTApi)**: The external storage provider used to host and delete the media files.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of image uploads are authenticated.
- **SC-002**: 100% parity maintained: when a `ServiceListing` is deleted, its associated UploadThing asset is provably deleted within a reasonable timeframe (synchronous or near real-time).
- **SC-003**: Upload operations complete successfully with visual feedback to the user on the frontend.

## Assumptions

- We are using the free or standard tier of UploadThing, which supports UTApi for programmatic file deletion.
- The authentication mechanism (Auth.js v5) is already implemented and can be accessed within the UploadThing route context.
- We only need to support 1 image per listing currently, as dictated by the `portfolioImageUrl` and `portfolioImageKey` fields in `ServiceListing`.
