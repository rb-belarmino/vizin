# Quickstart & Validation: Reviews & Ratings

## Prerequisites

1. The Vizin Next.js application must be running locally (`npm run dev`).
2. You must have at least one test user registered.
3. You must have at least one Service Listing created by a *different* user.

## Validation Scenarios

### Scenario 1: Leave a Review
1. Log in as a resident.
2. Navigate to the catalog and click on a service listing (created by someone else).
3. Interact with the `StarRating` component (ensure hover animations work and select a rating).
4. Fill out the `ReviewForm` with an optional comment and submit.
5. **Expected Outcome**: The review is created, the listing's average rating updates, and the new review appears in the reviews list/modal.

### Scenario 2: Prevent Self-Review
1. Log in as the provider of a service.
2. Navigate to your own service listing.
3. **Expected Outcome**: The `ReviewForm` or `StarRating` input should not be visible or should be disabled with a clear message indicating providers cannot rate their own services.

### Scenario 3: Update Existing Review
1. Log in as the resident from Scenario 1.
2. Navigate to the previously reviewed service.
3. Submit a new rating/comment.
4. **Expected Outcome**: The previous review is overwritten by the new one (no duplicates created), and the average rating is recalculated.

### Scenario 4: Delete Review
1. Log in as the resident who left the review.
2. Navigate to the reviewed service.
3. Click the delete/remove button on your review.
4. **Expected Outcome**: The review is removed from the list and the listing's average rating updates.

### Scenario 5: Cascade Deletion
1. Log in as the provider of the service.
2. Delete the service listing via the dashboard.
3. Check the database (Prisma Studio or psql).
4. **Expected Outcome**: The service listing is deleted AND all associated reviews for that listing are purged from the database automatically.
