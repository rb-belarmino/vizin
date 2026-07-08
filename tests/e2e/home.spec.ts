import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page and show the hero section', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Check if the title is present (update with actual title if needed)
    // We look for 'Vizin' text somewhere visible.
    await expect(page.getByText('Vizin', { exact: false }).first()).toBeVisible();
    
    // Check if there is an 'Entrar' or 'Publicar serviço' link (common CTAs on home page)
    const linkRegex = /Entrar|Publicar serviço/i;
    await expect(page.getByRole('link', { name: linkRegex }).first()).toBeVisible();
  });
});
