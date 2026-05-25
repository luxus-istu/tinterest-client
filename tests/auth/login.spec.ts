import { test, expect } from '@playwright/test';

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });
    test.describe.configure({ mode: 'serial' });

    test('existing user can login', async ({ page }) => {

        await page.fill('input[name="email"]', 'test@test.com');

        await page.fill('input[name="password"]', '11111111');

        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/matching|\/onboarding/);
    });

    test('not existing user cant login', async ({ page }) => {

        await page.fill('input[name="email"]', 'notexists@test.commmmm');

        await page.fill('input[name="password"]', '111111apapapa');

        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/login');
    });

    test('reject invalid input', async ({ page }) => {

        await page.fill('input[name="email"]', 'notemail.com');

        await page.fill('input[name="password"]', '1');

        await page.click('button[type="submit"]');

        await expect(page.locator('.field-error')).toBeVisible();
    });

    test('redirect to registration page', async ({ page }) => {

        await page.click('a[href="/register"]');

        await expect(page).toHaveURL("/register");
    });
});

