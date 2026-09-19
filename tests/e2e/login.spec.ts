import { test, expect } from '@playwright/test'

test.describe('Autenticacao', () => {
  test('deve mostrar campos de email e senha no login', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('input[type="email"]')
    await page.waitForSelector('input[type="password"]')
  })
})

test.describe('Relatorios', () => {
  test('deve exibir seletor de mes na pagina de relatorios', async ({ page }) => {
    await page.goto('/relatorios')
    await page.waitForSelector('select')
  })
})
