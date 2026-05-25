import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });
    test.describe.configure({ mode: 'serial' });

    test('new user can register', async ({ page }) => {

        const email = 'new_user' + Date.now().toString() + '@test.com';

        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', '00000000');
        await page.fill('input[name="firstName"]', 'Имя');
        await page.fill('input[name="lastName"]', 'Фамилия');

        await page.click('button[type="submit"]');

        await expect(page).toHaveURL("/register")
        await expect(page.getByText('Код отправлен на почту')).toBeVisible();
        await expect(page.getByText(email)).toBeVisible();
    });

    test('reject already registered user', async ({ page }) => {

        const email = 'test@test.com';

        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', '11111111');
        await page.fill('input[name="firstName"]', 'Имя');
        await page.fill('input[name="lastName"]', 'Фамилия');

        await page.click('button[type="submit"]');

        await expect(page.getByText('User with this email is already registered')).toBeVisible();
    });

    test('reject invalid email input', async ({ page }) => {

        const email = 'testtest.com';

        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', '11111111');
        await page.fill('input[name="firstName"]', 'Имя');
        await page.fill('input[name="lastName"]', 'Фамилия');

        await page.click('button[type="submit"]');

        await expect(page.locator("input[name='email']")).toHaveAttribute('data-focused', 'true');
    });

    test('redirect to login page', async ({ page }) => {
        await page.click('a[href="/login"]');

        await expect(page).toHaveURL("/login")
    });
});

