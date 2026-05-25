import { test, expect } from '../fixtures';

test.describe('matching', () => {
    test.setTimeout(60000);
    test.describe.configure({ mode: 'serial' });

    test('full matching (like then dislike)', async ({ loginAsAdmin }) => {
        const page = await loginAsAdmin();

        // Используем регулярное выражение, чтобы гарантированно поймать query-параметры
        await page.route(/\/discovery\/recommendation/, (route) => {
            console.log('MOCK HIT:', route.request().url());
            
            // Генерируем валидные ЦЕЛЫЕ числа для ID
            const generateId = (offset = 0) => {
                return Math.floor(Math.random() * (20000 - 10000) + 10000) + offset;
            };

            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    users: [
                        {
                            id: generateId(0),
                            firstName: "Имя",
                            lastName: "Фамилия",
                            middleName: "Отчество",
                            dateOfBirth: "2001-01-10",
                            gender: "FEMALE",
                            city: "Москва",
                            about: "о себе",
                            jobTitle: "Работа",
                            department: "Работа 1111",
                            goal: "Цель",
                            personalityType: "Персоналити",
                            timeSlots: ["AFTERNOON", "EVENING"],
                            avatarUrl: null,
                            interests: [{ id: 1, name: "Интерес 1" }, { id: 2, name: "Интерес 2" }]
                        },
                        {
                            id: generateId(1),
                            firstName: "Имя",
                            lastName: "Фамилия",
                            middleName: "Отчество",
                            dateOfBirth: "2001-01-10",
                            gender: "FEMALE",
                            city: "Ижевск",
                            about: "о себе",
                            jobTitle: "Работа",
                            department: "Работа 1111",
                            goal: "Цель",
                            personalityType: "Персоналити",
                            timeSlots: ["AFTERNOON", "EVENING"],
                            avatarUrl: null,
                            interests: [{ id: 1, name: "Интерес 1" }, { id: 2, name: "Интерес 2" }]
                        },
                        {
                            id: generateId(2),
                            firstName: "Имя",
                            lastName: "Фамилия",
                            middleName: "Отчество",
                            dateOfBirth: "2001-01-10",
                            gender: "FEMALE",
                            city: "Санкт-Петербург",
                            about: "о себе",
                            jobTitle: "Работа",
                            department: "Работа 1111",
                            goal: "Цель",
                            personalityType: "Персоналити",
                            timeSlots: ["AFTERNOON", "EVENING"],
                            avatarUrl: null,
                            interests: [{ id: 1, name: "Интерес 1" }, { id: 2, name: "Интерес 2" }]
                        },
                    ],
                    hasMore: false,
                    cycle: 7
                }),
            });
        });

        await page.goto('/matching');
        await expect(page).toHaveURL("/matching", { timeout: 10000 });

        const card = page.getByTestId("recommendation-card");
        await expect(card).toBeVisible({ timeout: 10000 });
        await expect(card.getByText("Москва")).toBeVisible({ timeout: 10000 });

        await card.getByTestId("like").click();
        await expect(card.getByText("Ижевск")).toBeVisible({ timeout: 10000 });

        await card.getByTestId("dislike").click();
        await expect(card.getByText("Санкт-Петербург")).toBeVisible({ timeout: 10000 });
    });
});