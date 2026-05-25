import { test, expect } from '../fixtures';

test.describe('chatting', () => {
    test.setTimeout(60000);
    test.beforeEach(async ({ page }) => {
    });

    test.describe.configure({ mode: 'serial' });

    test('write message to first chat', async ({ loginAsAdmin }) => {
        const page = await loginAsAdmin();

        const message = "привет!";

        await expect(page.locator('a[href="/chats"]')).toBeVisible({ timeout: 15000 });
        await page.locator('a[href="/chats"]').click();

        await expect(page.getByText("Выберите чат").first()).toBeVisible({ timeout: 15000 });
        await page.getByTestId('chatListItem').first().click();

        await expect(page.getByText("Выберите чат").first()).not.toBeVisible({ timeout: 10000 });

        // Ждём появления поля ввода (уже с фиксом из предыдущего ответа)
        const msgbar = page.getByTestId('chatInput').nth(1);
        const inputField = msgbar.getByTestId('chatInputField').first();

        await expect(msgbar).toBeVisible({ timeout: 10000 });
        await expect(inputField).toBeVisible({ timeout: 10000 });

        await inputField.fill(message);
        await msgbar.getByTestId('chatInputButton').click();

        await expect(page.getByTestId('message').getByText(message).last()).toBeVisible();
    });

    test('create group chat', async ({ loginAsAdmin }) => {
        const page = await loginAsAdmin();

        await expect(page.locator('a[href="/chats"]')).toBeVisible({ timeout: 15000 });
        await page.locator('a[href="/chats"]').click();

        await page.getByTestId('create-group-chat-button').click();

        const dialog = page.getByRole('dialog');

        await expect(dialog).toBeVisible();

        const name = 'Групповой чат - ' + Date.now();

        await dialog.locator('input[name="title"]').fill(name);
        await dialog.locator('input[name="search"]').fill('@');

        await dialog.getByTestId('user-search-result').nth(0).click();
        await dialog.getByTestId('user-search-result').nth(1).click();

        await dialog.locator('button').getByText("Создать").click();

        await expect(dialog).toBeHidden();

        await expect(page.getByTestId('chatListItem').getByText(name)).toBeVisible();
    });
});