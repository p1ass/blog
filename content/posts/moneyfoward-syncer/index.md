---
title: PlaywrightでMoneyForwardの資産入力を自動化する
date: 2022-08-12T00:15:00+09:00
draft: false
description: TODO
categories:
  - 開発
tags:
  - Playwright
  - TypeScript
  - MoneyForward
share: true
---

こんにちは、[@p1ass](https://twitter.com/p1ass) です。

TODO: Introduction を書く。

<!--more-->

## Playwright とは

{{<ex-link url="https://playwright.dev/">}}

## Playwright で MoneyForward にログインする

```typescript
test.beforeEach(async ({ page }) => {
  // Go to https://moneyforward.com/
  await page.goto('https://moneyforward.com/')

  // Click text=ログイン
  await page.locator('text=ログイン').click()

  // Click a:has-text("メールアドレスでログイン")
  await page.locator('a:has-text("メールアドレスでログイン")').click()

  // Click [placeholder="example\@moneyforward\.com"]
  await page.locator('[placeholder="example\\@moneyforward\\.com"]').click()

  // Fill [placeholder="example\@moneyforward\.com"]
  await page
    .locator('[placeholder="example\\@moneyforward\\.com"]')
    .fill(process.env.MONEYFORWARD_ID || '')

  // Click text=同意してログインする
  await page.locator('text=同意してログインする').click()

  // Click input[name="mfid_user\[password\]"]
  await page.locator('input[name="mfid_user\\[password\\]"]').click()

  // Fill input[name="mfid_user\[password\]"]
  await page
    .locator('input[name="mfid_user\\[password\\]"]')
    .fill(process.env.MONEYFORWARD_PASS || '')

  // Click input:has-text("ログインする")
  await page.locator('input:has-text("ログインする")').click()
  await page.waitForURL('https://moneyforward.com')
})
```

## 資産を更新する

`#TABLE_1` はテーブルによって値が変わるので、人によって変わる点に注意。

```typescript
test('update Hoge balance', async ({ page }) => {
  const usdPriceYen = await fetchHogeBalance()

  // Go to https://moneyforward.com/accounts/show_manual/xxxxxxxxxxxxxxx
  await page.goto('https://moneyforward.com/accounts/show_manual/xxxxxxxxxxxxxxx')

  await page.locator('#TABLE_1 > tbody > tr > td:nth-child(3) > a').click()

  // Click 変更 button
  await page.locator('#TABLE_1 >> input[name="user_asset_det\\[value\\]"]').click()

  // Fill price
  await page
    .locator('#TABLE_1 >> input[name="user_asset_det\\[value\\]"]')
    .fill(usdPriceYen.toString())

  // Click この内容で登録する
  await page.locator('#TABLE_1 >> input[name="commit"]').click()
})
```

## GitHub Actions で更新を自動化する

Playwright では、オフィシャルで GitHub Actions のテンプレートが用意されています。

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  schedule:
    - cron: '0 16 * * *'
jobs:
  test:
    timeout-minutes: 5
    runs-on: ubuntu-latest
    env:
      MONEYFORWARD_ID: ${{ secrets.MONEYFORWARD_ID }}
      MONEYFORWARD_PASS: ${{ secrets.MONEYFORWARD_PASS }}
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18.x'
      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"
      - uses: actions/cache@v3
        id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
        with:
          path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-
      - name: Install dependencies
        run: yarn
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: yarn playwright test
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```
