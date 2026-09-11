// リンクカードに出す OGP。
//
// リポジトリに持つ ogp-cache.json を参照する。更新は pnpm ogp:refresh の手動実行で、リンク先が生きているかどうかにビルドが左右されないようにしてある。
//
// 取りに行くのはキャッシュに無い URL だけで、リンクカードを足した直後だけこの流れを通る。
// ここで例外を投げてはいけない。@hono/vite-ssg はルートの例外を握りつぶし、ページの代わりに "Internal Server Error" を中身とする index.txt を書き出す。
// ビルドは成功したまま、その記事だけが本番から消える。実際に java-catch-up と line-dev-day-2018 がこの状態で出ていた。
import ogpCache from '../../ogp-cache.json'
import { fetchOgp, type Ogp } from './ogp-fetch'

export type { Ogp }

// 値が null の URL は、リンク先が消えていて取得できなかったもの。記録しておかないと、ビルドのたびに取得を試みては失敗する。
const cache = ogpCache as Record<string, Ogp | null>

// 同じ URL を複数の記事から参照していることがある。ビルドの中で取得は 1 回に留める。
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

// リンク先が消えていても記事そのものは出す。タイトルの代わりに URL を出し、画像は付けない。
function fallbackOgp(url: string): Ogp {
  return { title: url, description: '', image: null }
}
