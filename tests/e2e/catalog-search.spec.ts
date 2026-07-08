import { test, expect } from '@playwright/test';

test.describe('Catalog Search Flow', () => {
  test('should allow searching for a service and updating the URL', async ({ page }) => {
    await page.goto('/');

    // Fill the search input
    const searchInput = page.locator('#catalog-search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Encanador');

    // Click search
    await page.locator('#catalog-search-btn').click();

    // Verify the URL was updated
    await expect(page).toHaveURL(/\/\?q=Encanador/);

    // Verify that the "clear filters" button appears
    await expect(page.locator('#clear-filters-btn')).toBeVisible();

    // Click "clear filters" and verify it goes back to home
    await page.locator('#clear-filters-btn').click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
