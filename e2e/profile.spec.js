import { test, expect } from '@playwright/test'
test('mocked remote success, retry and local JSON under a repository path', async ({ page }) => {
  let fail = true
  await page.route('https://jsonplaceholder.typicode.com/users/*', route => fail ? route.fulfill({ status: 503, body: '{}' }) : route.fulfill({ json: { id: 1, name: 'Remote Test', email: 'remote@example.com' } }))
  await page.goto('./')
  await expect(page.getByRole('alert')).toContainText('503')
  fail = false
  await page.getByRole('button', { name: 'Повторить запрос' }).click()
  await expect(page.getByRole('heading', { name: 'Remote Test' })).toBeVisible()
  await page.getByLabel('Источник данных').selectOption('local')
  await expect(page.getByRole('heading', { name: 'Алексей Мороз' })).toBeVisible()
  await page.getByLabel('Пользователь', { exact: true }).selectOption('2')
  await expect(page.getByRole('heading', { name: 'Мария Лисова' })).toBeVisible()
  await page.reload()
  await page.getByLabel('Источник данных').selectOption('local')
  await expect(page.getByRole('heading', { name: 'Алексей Мороз' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
