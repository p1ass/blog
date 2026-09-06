type OgpApiResponse = {
  Policy: Policy
  Title: string
  Type: string
  URL: Url
  SiteName: string
  Image: Image[]
  Description: string
  Determiner: string
  Locale: string
  Favicon: string
}

type Policy = {
  TrustedTags: string[]
}

type Url = {
  Source: string
  Scheme: string
  Opaque: string
  User: null
  Host: string
  Path: string
  RawPath: string
  ForceQuery: boolean
  RawQuery: string
  Fragment: string
  Value: string
}

type Image = {
  URL: string
  SURL: string
  Type: string
  Width: number
  Height: number
  Alt: string
}

// リポジトリに持つキャッシュ。pnpm ogp:refresh で更新する。
// リンク先が生きているかどうかにビルドが左右されないように持つ。
import ogpCache from '../../ogp-cache.json'

const cache: { [url: string]: OgpApiResponse } = {}

export async function fetchOgp(url: string): Promise<OgpApiResponse> {
  if (cache[url]) {
    return cache[url]
  }

  // 値が null の URL は、リンク先が消えていて取得できなかったもの。
  // 記録しておかないと、ビルドのたびに取得を試みては失敗する。
  const entries = ogpCache as Record<string, OgpApiResponse | null>
  if (url in entries) {
    const cached = entries[url] ?? fallbackOgp(url)
    cache[url] = cached
    return cached
  }

  // キャッシュに無い URL はビルド時に取得する。リンクカードを足した直後だけこの流れを通る。
  // ここを通ったら pnpm ogp:refresh を回してコミットする。
  console.warn(`OGP がキャッシュに無いので取得します: ${url}`)
  const ogp = await fetchFromApi(url)
  cache[url] = ogp
  return ogp
}

async function fetchFromApi(url: string): Promise<OgpApiResponse> {
  try {
    const res = await fetch(`https://blog-api.p1ass.com/ogp?url=${url}`)
    if (res.status !== 200) {
      console.warn(`OGP を取得できませんでした (${res.status}): ${url}`)
      return fallbackOgp(url)
    }
    return await res.json<OgpApiResponse>()
  } catch (cause) {
    console.warn(`OGP の取得に失敗しました: ${url}`, cause)
    return fallbackOgp(url)
  }
}

// リンク先が消えていたり API が落ちていたりしても、記事そのものは出す。
//
// 以前はここで例外を投げていた。すると @hono/vite-ssg がページの代わりに
// "Internal Server Error" を index.txt として書き出し、ビルドは成功したまま
// その記事だけが本番から消えた。実際に line-dev-day-2018 が、2018 年の
// 会議のサイトが無くなったことでこの状態になっていた。
function fallbackOgp(url: string): OgpApiResponse {
  return {
    Policy: { TrustedTags: [] },
    Title: url,
    Type: '',
    URL: {
      Source: url,
      Scheme: '',
      Opaque: '',
      User: null,
      Host: new URL(url).host,
      Path: '',
      RawPath: '',
      ForceQuery: false,
      RawQuery: '',
      Fragment: '',
      Value: url,
    },
    SiteName: '',
    Image: [],
    Description: '',
    Determiner: '',
    Locale: '',
    Favicon: '',
  }
}
