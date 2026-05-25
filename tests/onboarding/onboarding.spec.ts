import { test, expect } from '../fixtures';

test.describe('onboarding', () => {
    test.setTimeout(60000);
    test.describe.configure({ mode: 'serial' });

    test('full onboarding', async ({ loginAsAdmin }) => {
        const page = await loginAsAdmin();

        await page.goto('/onboarding');

        await expect(page).toHaveURL("/onboarding", { timeout: 10000 });

        // 1
        await expect(page.locator('input[name="firstName"]')).toBeVisible();

        await page.locator('input[name="firstName"]').fill('Имя');
        await page.locator('input[name="lastName"]').fill('Фамилия');
        await page.locator('input[name="middleName"]').fill('Отчество');
        await page.locator('input[name="dateOfBirth"]').fill('1990-01-01');
        await page.locator('input[name="city"]').fill('Москва');
        await page.locator('textarea[placeholder="Расскажите о себе"]').fill('О себе');
        await page.click('button[type="submit"]');

        // 2
        await page.locator('h1').getByText('Фото профиля').waitFor({ state: 'attached' });
        await expect(page.locator('h1').getByText('Фото профиля')).toBeVisible();

        await page.click('button[type="submit"]');

        // 3
        await page.locator('h1').getByText('Интересы').waitFor({ state: 'attached' });
        await expect(page.locator('h1').getByText('Интересы')).toBeVisible();

        await page.locator('label[data-slot="checkbox"]').first().click();
        await page.locator('label[data-slot="checkbox"]').last().click();
        await page.click('button[type="submit"]');

        // 4
        await page.locator('h1').getByText('Работа').waitFor({ state: 'attached' });
        await expect(page.locator('h1').getByText('Работа')).toBeVisible();

        await page.locator('input[name="jobTitle"]').fill('Должность');
        await page.locator('input[name="department"]').fill('Отдел');
        await page.click('button[type="submit"]');

        // 5
        await page.locator('h1').getByText('Формат общения').waitFor({ state: 'attached' });
        await expect(page.locator('h1').getByText('Формат общения')).toBeVisible();

        await page.locator('button[data-slot="select-trigger"]').nth(0).click();
        await page.locator('div[data-slot="list-box-item"]').nth(1).click();

        await page.locator('button[data-slot="select-trigger"]').nth(1).click();
        await page.locator('div[data-slot="list-box-item"]').nth(1).click();

        await page.locator('label[data-slot="checkbox"]').first().click();
        await page.locator('label[data-slot="checkbox"]').last().click();

        await page.click('button[type="submit"]');

        // 6
        await page.locator('h1').getByText('О себе').waitFor({ state: 'attached' });
        await expect(page.locator('h1').getByText('О себе')).toBeVisible();

        await page.locator('textarea[placeholder="Расскажите о себе. Например: люблю горные лыжи, джаз и Rust"]').fill('О себе');

        await page.click('button[type="submit"]');

        // End
        await expect(page).toHaveURL("/matching");
    });
});

