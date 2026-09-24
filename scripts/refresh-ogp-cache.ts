#!/usr/bin/env node
import { createHash } from 'node:crypto'
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { fetchArchivedOgp, fetchOgp, type Ogp } from '../app/lib/ogp-fetch.ts'

const CACHE_PATH = 'ogp-cache.json'
const POSTS_DIR = 'app/routes/posts'
const IMAGE_DIR = 'public/ogp'
const IMAGE_PATH = '/ogp'

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
const archived: string[] = []

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

const imageExtensions: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

// Cross-Origin-Resource-Policy が same-origin か same-site の画像は、ブラウザが他サイトの <img> での読み込みを拒否する。
async function localizeIfBlocked(imageUrl: string): Promise<string | null> {
  const res = await fetch(imageUrl, { signal: AbortSignal.timeout(15_000) })
  const policy = res.headers.get('cross-origin-resource-policy')?.trim()
  if (!res.ok || (policy !== 'same-origin' && policy !== 'same-site')) {
    await res.body?.cancel()
    return null
  }
  const contentType = res.headers.get('content-type')?.split(';')[0].trim()
  const extension = contentType ? imageExtensions[contentType] : undefined
  if (extension === undefined) {
    throw new Error(`画像ではありません (${contentType ?? '種別の指定なし'})`)
  }
  const hash = createHash('sha256').update(imageUrl).digest('hex').slice(0, 16)
  const name = `${hash}.${extension}`
  mkdirSync(IMAGE_DIR, { recursive: true })
  writeFileSync(join(IMAGE_DIR, name), Buffer.from(await res.arrayBuffer()))
  return `${IMAGE_PATH}/${name}`
}

function removeUnusedImages(entries: Cache) {
  const used = new Set(
    Object.values(entries)
      .map(ogp => ogp?.image)
      .filter(image => image?.startsWith(`${IMAGE_PATH}/`))
      .map(image => image?.slice(IMAGE_PATH.length + 1)),
  )
  let files: string[]
  try {
    files = readdirSync(IMAGE_DIR)
  } catch {
    return
  }
  for (const file of files) {
    if (!used.has(file)) {
      rmSync(join(IMAGE_DIR, file))
    }
  }
}

async function forEachConcurrently<T>(
  items: T[],
  concurrency: number,
  run: (item: T) => Promise<void>,
) {
  const queue = [...items]
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) {
        await run(item)
      }
    }),
  )
}

for (const [index, url] of urls.entries()) {
  if (url in cache) {
    continue
  }
  process.stdout.write(`[${index + 1}/${urls.length}] ${url} ... `)
  try {
    cache[url] = await fetchOgp(url)
    console.log('取得')
  } catch (cause) {
    const reason = errorMessage(cause)
    try {
      cache[url] = await fetchArchivedOgp(url)
      console.log(`Internet Archive から取得 (${reason})`)
      archived.push(url)
    } catch (archiveCause) {
      const archiveReason = errorMessage(archiveCause)
      console.log(`失敗 (${reason} / ${archiveReason})`)
      failed.push(`${url} (${reason} / ${archiveReason})`)
      cache[url] = null
    }
  }
}

const alive: Cache = Object.fromEntries(
  urls.filter(url => url in cache).map(url => [url, cache[url]]),
)

const localized: string[] = []
const remoteEntries = Object.entries(alive).filter(
  (entry): entry is [string, Ogp & { image: string }] =>
    entry[1]?.image?.startsWith('http') === true,
)
await forEachConcurrently(remoteEntries, 16, async ([url, ogp]) => {
  try {
    const path = await localizeIfBlocked(ogp.image)
    if (path !== null) {
      ogp.image = path
      localized.push(url)
    }
  } catch (cause) {
    console.warn(
      `画像を確認できませんでした: ${ogp.image} (${errorMessage(cause)})`,
    )
  }
})
removeUnusedImages(alive)

writeFileSync(CACHE_PATH, `${JSON.stringify(alive, null, 2)}\n`)

console.log()
const fetched = Object.values(alive).filter(Boolean).length
console.log(`URL ${urls.length} 件のうち ${fetched} 件の OGP を取得しました。`)
if (archived.length > 0) {
  console.log(
    `${archived.length} 件は Internet Archive に保存されたページから取得しました。保存時点の内容なので、必要に応じて確認してください。`,
  )
  for (const url of archived) {
    console.log(`  ${url}`)
  }
}
if (localized.length > 0) {
  console.log(
    `${localized.length} 件は画像が他サイトからの読み込みを拒否しているため、${IMAGE_DIR} に保存しました。`,
  )
  for (const url of localized) {
    console.log(`  ${url}`)
  }
}
if (failed.length > 0) {
  console.log(
    `取得できなかった ${failed.length} 件は取得不可として記録しました。素のリンクとして描画されます。`,
  )
  for (const line of failed) {
    console.log(`  ${line}`)
  }
}
