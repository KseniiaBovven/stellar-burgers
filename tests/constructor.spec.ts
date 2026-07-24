import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.json', {
    notFound: 'fallback',
    update: false
  });
});

test.describe('Конструктор бургера', () => {
  test.describe('Добавление ингредиентов', () => {
    test('должен добавить булку в конструктор', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="ingredient-item"]', {
        timeout: 10000
      });

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await expect(
        page.locator('[data-testid="constructor-bun-top"]')
      ).toContainText('Краторная булка N-200i');
    });

    test('должен добавить начинку в конструктор', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="ingredient-item"]', {
        timeout: 10000
      });

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await expect(
        page.locator('[data-testid="constructor-ingredients"]')
      ).toContainText('Биокотлета из марсианской Магнолии');
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('должен открыть модальное окно при клике на ингредиент', async ({
      page
    }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="ingredient-item"]', {
        timeout: 10000
      });

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .locator('a')
        .click();

      await expect(page.locator('[data-testid="modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="modal"]')).toContainText(
        'Краторная булка N-200i'
      );
    });

    test('должен закрыть модальное окно по клику на крестик', async ({
      page
    }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="ingredient-item"]', {
        timeout: 10000
      });

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .locator('a')
        .click();

      await expect(page.locator('[data-testid="modal"]')).toBeVisible();
      await page.locator('[data-testid="modal-close"]').click();
      await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
    });

    test('должен закрыть модальное окно по клику на оверлей', async ({
      page
    }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="ingredient-item"]', {
        timeout: 10000
      });

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .locator('a')
        .click();

      await expect(page.locator('[data-testid="modal"]')).toBeVisible();
      await page
        .locator('[data-testid="modal-overlay"]')
        .click({ position: { x: 1, y: 1 } });
      await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test('должен оформить заказ и показать номер', async ({ page, context }) => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'Bearer test-token',
          domain: 'localhost',
          path: '/'
        }
      ]);

      await page.addInitScript(() => {
        localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      await page.goto('/');
      await page.waitForSelector('[data-testid="ingredient-item"]', {
        timeout: 10000
      });

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Краторная булка N-200i' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await page
        .locator('[data-testid="ingredient-item"]')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .locator('button', { hasText: 'Добавить' })
        .click();

      await page.locator('button', { hasText: 'Оформить заказ' }).click();

      await expect(page.locator('[data-testid="modal"]')).toBeVisible({
        timeout: 30000
      });
      await expect(page.locator('[data-testid="order-number"]')).toHaveText(
        '12345'
      );

      await expect(
        page.locator('[data-testid="constructor-bun-top"]')
      ).not.toBeVisible();

      await page.locator('[data-testid="modal-close"]').click();
      await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
    });
  });
});
