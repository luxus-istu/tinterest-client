import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

setup('authenticate', async ({ page }, testInfo) => {
    // const email = 'i.petrov@tbank.ru';
    // const password = 'SecurePass123!';

    // // 1. Логин
    // await page.goto('/login');
    // await page.locator('input[name="email"]').fill(email);
    // await page.locator('input[name="password"]').fill(password);
    // await page.click('button[type="submit"]');

    // // 2. Ждём успешного входа
    // await expect(page).not.toHaveURL('/login');
    // await page.waitForSelector('main', { state: 'attached', timeout: 10000 });

    // // 3. Используем testInfo вместо setup.info()
    // const projectName = testInfo.project.name.replace('setup-', '');
    // const authFile = path.join(process.cwd(), 'auth', `${projectName}-user.json`);

    // fs.mkdirSync(path.dirname(authFile), { recursive: true });
    // await page.context().storageState({ path: authFile });
});