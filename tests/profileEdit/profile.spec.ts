import { test, expect } from '../fixtures';

test.describe('profile', () => {
    test.setTimeout(180000);
    test.describe.configure({ mode: 'serial' });

    test('full profile editing', async ({ loginAsAdmin }) => {
        const page = await loginAsAdmin();

        await page.goto('/profile');
        await page.locator('a[href="/profile/edit"]').click();
        await page.locator('h1').getByText('Редактирование профиля').waitFor({ state: 'attached' });

        // Основная информация
        await page.locator('input[name="firstName"]').fill('Имя');
        await page.locator('input[name="lastName"]').fill('Фамилия');
        await page.locator('input[name="middleName"]').fill('Отчество');

        await page.locator('input[name="dateOfBirth"]').evaluate((el: HTMLInputElement, value) => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, 'value'
            )?.set;
            nativeInputValueSetter?.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, '1990-01-01');

        await page.locator('input[name="city"]').fill('Москва');
        await page.locator('textarea[placeholder="О себе"]').fill('О себе');

        const basicResponsePromise = page.waitForResponse('**/profiles/me/basic');
        await page.getByRole('button', { name: 'Сохранить основную информацию' }).click();
        await basicResponsePromise;
        await expect(page.getByText('Основная информация обновлена')).toBeVisible({ timeout: 5000 });

        // Работа
        await page.locator('input[name="jobTitle"]').fill('Должность');
        await page.locator('input[name="department"]').fill('Отдел');

        const workResponsePromise = page.waitForResponse('**/profiles/me/work');
        await page.getByRole('button', { name: 'Сохранить работу' }).click();
        await workResponsePromise;
        await expect(page.getByText('Информация о работе обновлена')).toBeVisible({ timeout: 5000 });

        // Цели и общение
        await page.getByTestId('goal-select').click();
        await page.getByTestId('goal-select-item-NEW_FRIENDS').click();

        await page.getByTestId('personality-type-select').click();
        await page.getByTestId('personality-type-select-item-EXTROVERT').click();

        await page.getByTestId('time-slot-MORNING').click();
        await page.getByTestId('time-slot-AFTERNOON').click();
        await page.getByTestId('time-slot-EVENING').click();

        const commResponsePromise = page.waitForResponse('**/profiles/me/communication');
        await page.getByRole('button', { name: 'Сохранить цели' }).click();
        await commResponsePromise;
        await expect(page.getByText('Информация о коммуникации обновлена')).toBeVisible({ timeout: 5000 });

        // Интересы
        await page.locator('label[data-slot="checkbox"]').first().click();
        await page.locator('label[data-slot="checkbox"]').last().click();

        const interestsResponsePromise = page.waitForResponse('**/profiles/me/interests');
        await page.getByRole('button', { name: 'Сохранить интересы' }).click();
        await interestsResponsePromise;
        await expect(page.getByText('Интересы обновлены')).toBeVisible({ timeout: 5000 });
    });
});