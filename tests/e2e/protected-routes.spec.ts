import { test, expect } from '@playwright/test';

test.describe('Protected Routes Security', () => {
  test('should redirect unauthenticated users from /dashboard to /login', async ({ page }) => {
    // Try to access private dashboard
    await page.goto('/dashboard');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('#tab-login')).toBeVisible();
  });

  test('should redirect unauthenticated users from /dashboard/novo to /login', async ({ page }) => {
    await page.goto('/dashboard/novo');
    
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should redirect unauthenticated users from /onboarding to /login', async ({ page }) => {
    await page.goto('/onboarding');
    
    await expect(page).toHaveURL(/.*\/login/);
  });
});
