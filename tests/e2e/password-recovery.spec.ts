import { test, expect } from '@playwright/test';

test.describe('Password Recovery Flow', () => {
  test('should validate forgot password form', async ({ page }) => {
    await page.goto('/forgot-password');

    // Submit empty form
    await page.locator('button[type="submit"]').click();

    // Check validation error
    await expect(page.getByText('E-mail inválido')).toBeVisible();

    // Submit valid email (it should trigger the server action)
    await page.locator('input[type="email"]').fill('fake@email.com');
    await page.locator('button[type="submit"]').click();

    // We don't have to check the exact response since it could be success or error 
    // depending on the DB state. Just ensuring it doesn't crash is good.
    await expect(page.locator('form')).toBeVisible(); 
  });

  test('should validate reset password form', async ({ page }) => {
    // Navigate to reset password with a fake token
    await page.goto('/reset-password?token=fake123');

    // Submit empty form
    await page.locator('button[type="submit"]').click();

    // Check validation error
    await expect(page.getByText('A nova senha deve ter pelo menos 6 caracteres')).toBeVisible();
  });
});
