// @hono/vite-ssg はルートの例外でページの代わりに index.txt を書き出し、記事が本番から消えるので、取得の失敗では例外を投げない。
import ogpCache from '../../ogp-cache.json'
import { fetchOgp, type Ogp } from './ogp-fetch'

export type { Ogp }

const cache = ogpCache as Record<string, Ogp | null>

const fetched = new Map<string, Ogp>()

export async function getOgp(url: string): Promise<Ogp> {
  if (url in cache) {
    return cache[url] ?? fallbackOgp(url)
  }

  const memo = fetched.get(url)
  if (memo !== undefined) {
    return memo
  }

  console.warn(
    `OGP がキャッシュに無いので取得します: ${url} (pnpm ogp:refresh を回してコミットしてください)`,
  )
  const ogp = await tryFetch(url)
  fetched.set(url, ogp)
  return ogp
}

async function tryFetch(url: string): Promise<Ogp> {
  try {
    return await fetchOgp(url)
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause)
    console.warn(`OGP を取得できませんでした: ${url} (${reason})`)
    return fallbackOgp(url)
  }
}

function fallbackOgp(url: string): Ogp {
  return { title: url, description: '', image: null }
}
