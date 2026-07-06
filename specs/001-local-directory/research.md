# Research & Best Practices: Vizin Marketplace

## Clean Architecture with Next.js 16 App Router
- **Decision**: Strict boundary between Next.js UI/Framework and core business logic.
- **Rationale**: The constitution demands business logic lives purely inside TypeScript domain entities and use-cases. Next.js App Router allows using Server Actions, which will act solely as thin controllers.
- **Alternatives considered**: Traditional MVC within Next.js api routes (rejected due to Constitution mandate).

## Auth.js v5 Split Config Pattern (Edge Compatibility)
- **Decision**: Separate Auth.js configuration into `auth.config.ts` (Edge compatible, containing providers and callbacks) and `auth.ts` (Node.js runtime, containing the Prisma adapter).
- **Rationale**: Vercel Edge Runtime cannot run Node-dependent libraries like Prisma Client or `bcryptjs`. The middleware requires Edge, so the config must be split.
- **Alternatives considered**: Using a separate auth server (overkill), using JWTs exclusively without DB session lookup (doesn't fit full security needs).

## UploadThing & Database Parity
- **Decision**: Use UploadThing webhooks/callbacks to manage physical file lifecycle directly from Server Actions or domain use-cases that handle listing deletion.
- **Rationale**: Constitution rule V requires precise parity and garbage collection of orphaned assets.
- **Alternatives considered**: AWS S3 with manual SDK (UploadThing is already homologated in stack).

## Transactional Emails (Password Recovery)
- **Decision**: Use Resend (with React Email) to handle transactional email delivery.
- **Rationale**: Best-in-class developer experience for Next.js environments, fast edge execution, and easy local templating.
- **Alternatives considered**: Nodemailer (requires SMTP config, heavier), SendGrid (more complex setup for simple use cases).
