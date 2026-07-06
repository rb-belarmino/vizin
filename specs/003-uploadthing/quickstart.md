# Quickstart: UploadThing Validation

This guide outlines how to validate the UploadThing integration end-to-end.

## Prerequisites

1. An active UploadThing account and project.
2. `UPLOADTHING_TOKEN` configured in the `.env` file.
3. Authenticated session in the local Vizin environment.

## Validation Scenarios

### 1. Uploading an Image

1. Start the development server: `npm run dev`
2. Log in as a service provider.
3. Navigate to the "Create Service Listing" page.
4. Drag and drop a valid image (e.g., < 4MB PNG) into the UploadDropzone.
5. **Expected Outcome**: The file uploads successfully. The form receives the `portfolioImageUrl` and `portfolioImageKey`.

### 2. Form Submission

1. After a successful upload, submit the Service Listing form.
2. **Expected Outcome**: The database record is created with the image URL and key. The UI reflects the new image.

### 3. Orphan Cleanup (Garbage Collection)

1. Delete the created Service Listing through the UI.
2. **Expected Outcome**: The listing is removed from NeonDB.
3. Verify via UploadThing Dashboard: The associated file should no longer exist.
4. *Note*: If the synchronous deletion failed, the Vercel Cron Job (`/api/cron/cleanup-images`) can be triggered manually to verify the fallback cleanup.
