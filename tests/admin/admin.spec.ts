import { test, expect } from '../fixtures';

test.describe('matching', () => {
    test.setTimeout(120000);
    test.describe.configure({ mode: 'serial' });

    test('add and delete interest @sequential', async ({ loginAsAdmin }) => {
        const page = await loginAsAdmin();

        await page.goto('/admin');
        await expect(page).toHaveURL("/admin", { timeout: 10000 });

        await page.locator('button').getByText('Интересы').click();

        await page.locator('input[placeholder="Название интереса"]').fill('.');
        await page.locator('button').getByText('Добавить').click();

        await expect(page.locator('td[class="table__cell"]').getByText('.').first()).toBeVisible({ timeout: 10000 });   

        await page.locator('tr[class="table__row"] button').first().getByText('Удалить').click();

        await expect(page.locator('td[class="table__cell"]').getByText('.')).not.toBeVisible({ timeout: 10000 });
    });
});