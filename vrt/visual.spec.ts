import { expect, type Page, test } from '@playwright/test'

const pages = [
  { name: 'top', path: '/' },
  { name: 'categories', path: '/categories/' },
  { name: 'tags', path: '/tags/' },
  { name: 'styleguide', path: '/styleguide/' },
  { name: 'post-java-catch-up', path: '/posts/java-catch-up/' },
  { name: 'post-isucon11', path: '/posts/isucon11/' },
  { name: 'post-isucon13', path: '/posts/isucon13/' },
  {
    name: 'post-oauth-2-for-browser-apps',
    path: '/posts/oauth-2-for-browser-apps/',
  },
  { name: 'post-enum', path: '/posts/enum/' },
]

const placeholderPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8U88ABAwCAmYCz6cAAAAASUVORK5CYII=',
  'base64',
)

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const host = new URL(route.request().url()).hostname
    if (host === '127.0.0.1' || host === 'localhost') {
      return route.continue()
    }
    if (route.request().resourceType() === 'image') {
      return route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: placeholderPng,
      })
    }
    return route.abort()
  })
})

for (const { name, path } of pages) {
  test(name, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'load' })

    expect(response?.status(), `${path} が 200 を返さない`).toBe(200)

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForFunction(() =>
      Array.from(document.images).every(image => image.complete),
    )
    await page.evaluate(() => document.fonts.ready)

    await waitForStableHeight(page)

    await page.screenshot({ fullPage: true })
    await waitForStableHeight(page)

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      timeout: 30_000,
    })
  })
}

async function waitForStableHeight(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise(resolve => {
        let previous = -1
        let stableCount = 0
        const tick = () => {
          const current = document.documentElement.scrollHeight
          stableCount = current === previous ? stableCount + 1 : 0
          previous = current
          if (stableCount >= 5) {
            resolve(true)
            return
          }
          requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }),
    undefined,
    { timeout: 30_000 },
  )
}
