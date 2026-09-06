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
  // 0.5px の境界線と、寸法指定のない画像のせいで、十数回に 1 回ほど数百ピクセルの差が出る。
  // 見た目を実際に変えたときは再試行しても必ず落ちるので、検出できる範囲は狭まらない。原因を直したら 0 に戻す。
  retries: 2,
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
      // 0 にできないのは、border-top: 0.5px のサブピクセル境界線が端数位置によって描かれたり消えたりするため。太さを 1px に揃えたら 0 に下げる。
      maxDiffPixels: 800,
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
    // ダークの値を入れるまで、colorScheme: 'dark' はライトと同じ画像になる。
    // 同じ画像を 2 組持つとリポジトリの容量が増えるだけなので、ダークモードを入れるときに desktop-dark と mobile-dark を足す。
  ],

  webServer: {
    command: 'node vrt/serve.mjs',
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(port) },
  },
})
