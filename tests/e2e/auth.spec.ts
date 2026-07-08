import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start at the login page
    await page.goto('/login');
  });

  test('should show validation errors when trying to login with empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.locator('#login-submit-btn').click();
    
    // Zod validation should kick in on the client side
    await expect(page.getByText('Invalid email format.')).toBeVisible();
  });

  test('should show server error when logging in with invalid credentials', async ({ page }) => {
    // Fill the login form
    await page.locator('#login-email').fill('fake@email.com');
    await page.locator('#login-password').fill('wrongpassword123');
    
    // Submit
    await page.locator('#login-submit-btn').click();
    
    // Expect the server action error to appear
    await expect(page.getByText('Invalid credentials!')).toBeVisible();
  });

  test('should toggle between Login and Register tabs', async ({ page }) => {
    // Check that login form is visible by default
    await expect(page.locator('#login-form')).toBeVisible();
    await expect(page.locator('#register-form')).toBeHidden();

    // Click on Register tab
    await page.locator('#tab-register').click();

    // Now register form should be visible
    await expect(page.locator('#login-form')).toBeHidden();
    await expect(page.locator('#register-form')).toBeVisible();

    // Validate register form client-side errors
    await page.locator('#register-submit-btn').click();
    await expect(page.getByText('Name must be at least 2 characters long.')).toBeVisible();
  });
});
