import { expect, type Page, test } from '@playwright/test'

// 撮る対象。実在のページに加えてスタイルガイドを撮る。
// 記事は、見た目の要素を網羅するように選んである。
const pages = [
  { name: 'top', path: '/' },
  { name: 'categories', path: '/categories/' },
  { name: 'tags', path: '/tags/' },
  { name: 'styleguide', path: '/styleguide/' },
  // 表・コード・画像・リンクカードを一通り持つ記事
  { name: 'post-java-catch-up', path: '/posts/java-catch-up/' },
  // 15 列の表がある記事。モバイルでの横あふれを見張る
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

// 1x1 の灰色 PNG。外部画像の差し替え先として使う。
const placeholderPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8U88ABAwCAmYCz6cAAAAASUVORK5CYII=',
  'base64',
)

test.beforeEach(async ({ page }) => {
  // 外部への通信を止める。CDN やウィジェットの応答でスクリーンショットが
  // 揺れると、見た目の変更を検出するという目的を果たせなくなる。
  //
  // ただし画像だけは abort ではなく、決まったプレースホルダを返す。
  // abort すると壊れた画像の描画が実行ごとに揺れ、リンクカードを 16 個持つ
  // java-catch-up では 3000 ピクセル以上の差になった。
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

    // 200 以外を撮らない。
    //
    // これが無かったとき、ビルドが失敗して index.html が出ていない記事の
    // 404 ページが、そのまま基準画像として保存された。以降の比較も 404 どうしで
    // 一致するため緑になり、CI で実ページが出て初めて発覚した。
    expect(response?.status(), `${path} が 200 を返さない`).toBe(200)

    // 遅延読み込みの画像を出し切ってから撮る
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForFunction(() =>
      Array.from(document.images).every(image => image.complete),
    )
    await page.evaluate(() => document.fonts.ready)

    await waitForStableHeight(page)

    // 捨てる 1 枚を先に撮る。
    //
    // fullPage の撮影はビューポートをページの全高に広げる。すると、それまで
    // 可視域の外にあった外部画像がまとめて読み込みに行き、遮断されて壊れた
    // 画像のボックスが確定する。java-catch-up ではこれで高さが 81px 変わり、
    // 1 枚目と 2 枚目が一致しなかった。2 枚目以降は安定する。
    await page.screenshot({ fullPage: true })
    await waitForStableHeight(page)

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      // エミュレーション下では 1 枚が重いので、既定の 5 秒では足りない
      timeout: 30_000,
    })
  })
}

// 画像に width/height が付いていないため、読み込みの終わりぎわに
// ページ全体の高さが動く。動かなくなるまで待つ。
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
