// tests/fixtures.ts
import { test as base, expect, Page, BrowserContext } from '@playwright/test';

const ADMIN_ACCOUNTS = [
  { email: 'admin1@tbank.ru', password: '00000000' },
  { email: 'admin2@tbank.ru', password: '00000000' },
  { email: 'admin3@tbank.ru', password: '00000000' },
];

type AuthFixtures = {
  loginAsAdmin: () => Promise<Page>;
};

type WorkerFixtures = {
  workerAdmin: typeof ADMIN_ACCOUNTS[0];
};

export const test = base.extend<AuthFixtures, WorkerFixtures>({
  workerAdmin: [async ({}, use, workerInfo) => {
    const index = workerInfo.workerIndex % ADMIN_ACCOUNTS.length;
    await use(ADMIN_ACCOUNTS[index]);
  }, { scope: 'worker' }],

  loginAsAdmin: async ({ browser, workerAdmin }, use) => {
    const contexts: BrowserContext[] = [];

    await use(async () => {
      const context = await browser.newContext();
      contexts.push(context);

      const page = await context.newPage();
      await page.goto('/login');
      await page.locator('input[name="email"]').fill(workerAdmin.email);
      await page.locator('input[name="password"]').fill(workerAdmin.password);
      await page.click('button[type="submit"]');
      await expect(page).not.toHaveURL('/login', { timeout: 15000 });

      return page;
    });

    for (const context of contexts) {
      await context.close();
    }
  },
});

export { expect };