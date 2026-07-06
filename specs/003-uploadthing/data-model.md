# Data Model: UploadThing Integration

## Entity: ServiceListing

The existing `ServiceListing` entity in `prisma/schema.prisma` will be extended with optional fields to store the uploaded image metadata.

### Fields

- `portfolioImageUrl` (String, Optional/Nullable): The direct URL to the image hosted on UploadThing.
- `portfolioImageKey` (String, Optional/Nullable): The unique UploadThing file key (e.g., `ut-xxx`) used for deleting the file via UTApi.

### Validation Rules

- Both fields are optional.
- If provided, `portfolioImageUrl` must be a valid URL.
- If provided, `portfolioImageKey` must be a non-empty string.

### State Transitions

- **Creation**: When a user creates a listing, they can optionally provide an image. The file is uploaded to UploadThing first, and the resulting URL/Key are saved to the database.
- **Update (Image Replacement)**: If a new image is uploaded, the old `portfolioImageKey` MUST be deleted from UploadThing.
- **Deletion**: When the `ServiceListing` is deleted, its associated `portfolioImageKey` MUST be deleted from UploadThing.

## Entity: UploadThing File (External)

- Hosted by UploadThing.
- **Max Size**: 4MB.
- **Types Allowed**: `image/jpeg`, `image/png`, `image/webp`.
