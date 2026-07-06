# Research: UploadThing Integration

## Technical Context Resolution

1. **UploadThing Implementation in Next.js 16 App Router**
   - **Decision**: Use `@uploadthing/react` components combined with a custom `useUploadThing` hook for UI alignment, and `app/api/uploadthing/core.ts` for the server-side file router.
   - **Rationale**: Best practice for Next.js App Router. It natively supports Server Actions and Edge/Node runtimes.
   - **Alternatives considered**: Raw AWS S3 (rejected due to complexity in presigned URL generation and webhooks), Cloudinary (rejected in favor of UploadThing as per spec).

2. **Database Parity (Garbage Collection)**
   - **Decision**: Implement `UTApi.deleteFiles` within the `ServiceListing` deletion use-case (Server Action) as a non-blocking step, supplemented by a Vercel Cron Job.
   - **Rationale**: Ensures synchronous cleanup attempt without blocking the DB transaction if UploadThing is down. The Vercel Cron Job ensures eventual consistency.
   - **Alternatives considered**: Background job queue like Inngest (rejected to keep infrastructure simple and free via Vercel).

3. **Authentication Boundary**
   - **Decision**: Validate the session within the UploadThing File Router using Auth.js v5 before allowing uploads.
   - **Rationale**: Conforms to Vizin Constitution Principle IV (Safe Cryptography & Edge Compatibility).

## Security & Vizin Constitution Alignment
- Follows Clean Architecture by keeping DB calls in pure domain use-cases.
- Auth.js v5 is used securely.
- Satisfies Principle V (Garbage Collection) directly.
