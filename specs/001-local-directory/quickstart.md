# Quickstart Validation Guide

This guide validates the end-to-end functionality of the Vizin Marketplace feature without requiring full test suite execution.

## Setup
1. Clone repository and run `npm install`.
2. Ensure Docker is running for local NeonDB Postgres substitute (or link to real Neon branch).
3. Push Prisma schema: `npx prisma db push`.
4. **Seed demo data**: `npm run db:seed` (creates 4 demo residents and 8 public listings).
5. Configure `.env.local` with `UPLOADTHING_TOKEN`, `AUTH_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.
6. Run dev server: `npm run dev`.

> **Demo credentials** (created by seed): `ana@vizin.demo`, `carlos@vizin.demo`, `mariana@vizin.demo`, `roberto@vizin.demo` — senha: `demo1234`

## Scenario 1: Unauthenticated Flow (Public Catalog)
1. Open an incognito browser window.
2. Navigate to `http://localhost:3000/`.
3. **Verify**: You see the Vizin navbar, the dark hero section, and a grid of 8 seeded listings.
4. Navigate to `http://localhost:3000/dashboard`.
5. **Verify**: You are redirected to `/login`.


## Scenario 2: Provider Registration & Listing Creation
1. On the `/login` page, click "Sign up".
2. Register with `John Doe`, `john@example.com`, `password123`, and Apartment `101`.
3. **Verify**: You are redirected to `/dashboard`.
4. *(Alternative — Google OAuth)*: Click "Continuar com o Google", authorize the app, fill in Apartment `101` on the `/onboarding` page, and verify you are redirected to `/dashboard`.
5. Click "Nova Oferta" (New Listing).
6. Fill out the form, upload an image via UploadThing, and enter a WhatsApp number.
7. Submit the form.
8. **Verify**: The new listing appears in your private dashboard.

## Scenario 3: Parity & Deletion
1. In the `/dashboard`, click the "Delete" icon on your created listing.
2. **Verify**: The listing disappears from the dashboard.
3. Check your UploadThing dashboard (or local webhook logs).
4. **Verify**: The physical image asset was purged.

## Scenario 4: Profile & Password Recovery
1. Go to `/dashboard/profile` and change your name.
2. **Verify**: Changes reflect in the UI and your listings.
3. Logout, go to `/login`, and click "Forgot Password".
4. Enter `john@example.com` and submit.
5. **Verify**: Check terminal (or Resend logs) for the recovery token URL.
6. Open the recovery link, set a new password, and login.
