#!/usr/bin/env node
// 記事が参照している外部リンクの OGP を取得し、ogp-cache.json に書き出す。
//
// ビルドを外部サービスとリンク先サイトの死活から切り離すために持つ。以前はビルドのたびに 188 件の URL を取りに行っていた。
// そのためリンク先が 1 つ消えるだけで記事が出力されなくなり、応答の揺れでビルド結果そのものが変わっていた。
//
// 実行は手動。リンクカードを足したときや、カードの内容を更新したいときに回す。
//
//   pnpm ogp:refresh            キャッシュに無い URL だけ取る
//   pnpm ogp:refresh --all      全 URL を取り直す

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CACHE_PATH = 'ogp-cache.json'
const POSTS_DIR = 'app/routes/posts'
const API = 'https://blog-api.p1ass.com/ogp'

function collectUrls() {
  const urls = new Set()
  for (const slug of readdirSync(POSTS_DIR)) {
    const path = join(POSTS_DIR, slug, 'index.mdx')
    let source
    try {
      source = readFileSync(path, 'utf-8')
    } catch {
      continue
    }
    // コメントアウトされたカードは対象外。{/* <ExLinkCard .../> */} の形で残っている記事がある。
    const body = source.replaceAll(/\{\/\*[\s\S]*?\*\/\}/g, '')
    for (const match of body.matchAll(/<ExLinkCard[^>]*url="([^"]+)"/g)) {
      urls.add(match[1])
    }
  }
  return [...urls].sort()
}

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

const refreshAll = process.argv.includes('--all')
const cache = refreshAll ? {} : loadCache()
const urls = collectUrls()
const failed = []

for (const [index, url] of urls.entries()) {
  if (url in cache) {
    continue
  }
  process.stdout.write(`[${index + 1}/${urls.length}] ${url} ... `)
  try {
    const res = await fetch(`${API}?url=${url}`)
    if (res.status !== 200) {
      console.log(`失敗 (${res.status})`)
      failed.push(`${url} (${res.status})`)
      // 取得できなかったことも記録する。そうしないとビルドのたびに取りに行く。
      // リンク先が復活したときは --all で取り直す。
      cache[url] = null
      continue
    }
    cache[url] = await res.json()
    console.log('取得')
  } catch (cause) {
    console.log(`失敗 (${cause.message})`)
    failed.push(`${url} (${cause.message})`)
    cache[url] = null
  }
}

// 記事から消えた URL はキャッシュからも取り除く
const alive = Object.fromEntries(
  urls.filter(url => url in cache).map(url => [url, cache[url]]),
)

writeFileSync(CACHE_PATH, `${JSON.stringify(alive, null, 2)}\n`)

console.log()
const fetched = Object.values(alive).filter(Boolean).length
console.log(`URL ${urls.length} 件のうち ${fetched} 件の OGP を取得しました。`)
if (failed.length > 0) {
  console.log(
    `取得できなかった ${failed.length} 件は取得不可として記録しました。素のリンクとして描画されます。`,
  )
  for (const line of failed) {
    console.log(`  ${line}`)
  }
}
