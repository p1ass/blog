import { expect, type Page, test } from '@playwright/test'

const pages = [
  { name: 'top', path: '/' },
  { name: 'categories', path: '/categories/' },
  { name: 'tags', path: '/tags/' },
  { name: 'styleguide', path: '/styleguide/' },
  // 表・コード・画像・リンクカードを一通り持つ記事
  { name: 'post-java-catch-up', path: '/posts/java-catch-up/' },
  // 15 列の表がある記事。モバイルでの横あふれを検出するために置く
  { name: 'post-isucon11', path: '/posts/isucon11/' },
  // Mermaid 図がある唯一の記事
  { name: 'post-isucon13', path: '/posts/isucon13/' },
  // Note を使っている記事
  {
    name: 'post-oauth-2-for-browser-apps',
    path: '/posts/oauth-2-for-browser-apps/',
  },
  // 脚注を使っている記事
  { name: 'post-enum', path: '/posts/enum/' },
]

const placeholderPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8U88ABAwCAmYCz6cAAAAASUVORK5CYII=',
  'base64',
)

test.beforeEach(async ({ page }) => {
  // 外部の応答で撮影が揺れないよう通信を止める。画像を abort すると描画が実行ごとに揺れるので、決まったプレースホルダを返す。
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

    // ビルドに失敗した記事の 404 ページを基準画像として保存しないよう、200 以外を撮らない。
    expect(response?.status(), `${path} が 200 を返さない`).toBe(200)

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForFunction(() =>
      Array.from(document.images).every(image => image.complete),
    )
    await page.evaluate(() => document.fonts.ready)

    await waitForStableHeight(page)

    // fullPage の撮影で可視域の外の外部画像が読み込まれてページの高さが変わるので、捨てる 1 枚を先に撮る。
    await page.screenshot({ fullPage: true })
    await waitForStableHeight(page)

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      timeout: 30_000,
    })
  })
}

// 画像に width/height が付いていないため、読み込みが終わる直前にページ全体の高さが動く。動かなくなるまで待つ。
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
