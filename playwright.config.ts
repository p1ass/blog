import { defineConfig, devices } from '@playwright/test'

// 見た目の回帰テスト。ビルド済みの dist/ を静的に配って撮る。
//
// 基準画像は Playwright 公式イメージ (Linux) で撮る。OS フォントをそのまま使う方針なので、macOS で撮ると Hiragino になり CI と一致しない。
// ローカルからは pnpm vrt / pnpm vrt:update を使うこと。
const port = 4173

export default defineConfig({
  testDir: './vrt',
  outputDir: './vrt/.results',
  // {platform} を入れて、macOS で撮った画像が Linux の基準画像を上書きしないようにする。リポジトリにコミットするのは -linux のものだけ。
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{projectName}/{arg}-{platform}{ext}',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // 揺れの原因だった 0.5px の境界線と、寸法指定のない画像を両方直したので 0 にした。
  // 再試行があると、撮影の揺れとデザインの変更が同じ「落ちた」で混ざる。揺れが無いなら、落ちたことがそのまま変更を意味する。
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      // 既定の 0.2 は「知覚的に同じ色」を同一とみなす。この値のままだと、accent を #4172b5 から #4172b8 に変えても 18 ページ中 16 ページで検出できなかった。
      // 色の変更を捕まえるのが目的なので 0 にする。
      threshold: 0,

      // 比率ではなく絶対値で置く。ratio 0.001 でも 1 万 2000px の記事では 1 万ピクセル超の差を見逃すが、絶対値ならデザインの変更は必ず捕まる。
      //
      // 0 にできる。以前は border-top: 0.5px のサブピクセル境界線と、寸法指定のない画像の 2 つで揺れていた。
      // 前者はステップ 4 で 1px に揃え、後者はステップ 7 で rehype-image-size を入れて解消した。閾値 0 で 3 回続けて 18 ページとも一致することを確認している。
      maxDiffPixels: 0,
    },
  },

  projects: [
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'mobile-light',
      use: {
        ...devices['Pixel 7'],
        // プリセットの 2.625 のままだと基準画像が 7 倍の大きさになる。確かめたいのは CSS ピクセル上のレイアウトなので 1 で足りる。
        deviceScaleFactor: 1,
        colorScheme: 'light',
      },
    },
    {
      name: 'desktop-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
    {
      name: 'mobile-dark',
      use: {
        ...devices['Pixel 7'],
        deviceScaleFactor: 1,
        colorScheme: 'dark',
      },
    },
  ],

  webServer: {
    command: 'node vrt/serve.mjs',
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(port) },
  },
})
