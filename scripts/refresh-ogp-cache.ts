#!/usr/bin/env node
// 使い方: pnpm ogp:refresh でキャッシュに無い URL だけ、--all で全 URL を取り直す。

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fetchOgp, type Ogp } from '../app/lib/ogp-fetch.ts'

const CACHE_PATH = 'ogp-cache.json'
const POSTS_DIR = 'app/routes/posts'

type Cache = Record<string, Ogp | null>

function collectUrls(): string[] {
  const urls = new Set<string>()
  for (const slug of readdirSync(POSTS_DIR)) {
    const path = join(POSTS_DIR, slug, 'index.mdx')
    let source: string
    try {
      source = readFileSync(path, 'utf-8')
    } catch {
      continue
    }
    // {/* <ExLinkCard .../> */} とコメントアウトされたカードは対象外。
    const body = source.replaceAll(/\{\/\*[\s\S]*?\*\/\}/g, '')
    for (const match of body.matchAll(/<ExLinkCard[^>]*url="([^"]+)"/g)) {
      urls.add(match[1])
    }
  }
  return [...urls].sort()
}

function loadCache(): Cache {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

const refreshAll = process.argv.includes('--all')
const cache: Cache = refreshAll ? {} : loadCache()
const urls = collectUrls()
const failed: string[] = []

for (const [index, url] of urls.entries()) {
  if (url in cache) {
    continue
  }
  process.stdout.write(`[${index + 1}/${urls.length}] ${url} ... `)
  try {
    cache[url] = await fetchOgp(url)
    console.log('取得')
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause)
    console.log(`失敗 (${reason})`)
    failed.push(`${url} (${reason})`)
    // 記録しないとビルドのたびに取得を試みる。
    cache[url] = null
  }
}

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
