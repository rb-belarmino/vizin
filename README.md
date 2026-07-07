# Vizin

Vizin is a modern, hyper-local marketplace platform connecting residents with reliable neighborhood service providers.

## Tech Stack

This project is built with a strictly typed, full-stack architecture optimized for the Edge:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Database**: NeonDB (Serverless PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Auth.js v5](https://authjs.dev/) (Credentials Provider with Edge support)
- **Storage**: [UploadThing](https://uploadthing.com/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) (inspired by shadcn/ui)

## Getting Started

First, install dependencies:

```bash
npm install
```

Ensure your `.env` is properly configured. You will need to set up the following environment variables:

- `DATABASE_URL`: NeonDB connection string
- `AUTH_SECRET`: Auth.js secret (can be generated via `npx auth secret`)
- `UPLOADTHING_TOKEN`: UploadThing API token
- `RESEND_API_KEY`: Resend API key for sending emails
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Commands

- Run migrations: `npx prisma db push` (or `npx prisma migrate dev`)
- Seed demo data: `npm run db:seed`
- Browse database locally: `npx prisma studio`

## Architecture & Contribution Guidelines

This project strictly follows the constraints defined in our **[Vizin Constitution](.specify/memory/constitution.md)**. All developers must read the Constitution before contributing.

**Key principles include:**

1. **Clean & Modular Architecture**: Business logic must reside purely in TypeScript domain entities and use-cases, separated from the Next.js infrastructure.
2. **Server Actions as Controllers**: Next.js Server Actions should only validate inputs using Zod and delegate processing to pure use-cases.
3. **Test-Driven Development (TDD)**: Unit tests via Vitest are mandatory for core domain logic prior to implementation.
4. **Data Sync**: Storage assets must maintain exact parity with the database (strict garbage collection).

Please refer to the `specs/` directory for detailed documentation on individual features and implemented user stories.
