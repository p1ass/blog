// リンク先のページから OGP を取る。
//
// 以前は blog-api.p1ass.com という別のサービスに問い合わせていた。取りに行くのは HTML の meta タグだけなので、
// サービスが生きているかどうかにビルドが左右される形をやめて、こちらで取って解析する。
//
// 取得と解析を分けてあるのは、解析だけをテストに掛けるため。ネットワークをまたぐ側は、失敗したら null を返す薄い皮にしてある。

export type Ogp = {
  title: string
  description: string
  image: string | null
}

// 名乗る名前と連絡先を入れる。素の fetch は User-Agent を送らず、名無しの要求として弾くサイトがある。
const userAgent =
  'Mozilla/5.0 (compatible; p1ass-blog-ogp/1.0; +https://blog.p1ass.com/)'

// 応答が返らないリンク先でビルドが止まらないようにする。
const timeoutMs = 15_000

// meta タグを 1 つずつ取り出す。属性値の中の > で切らないよう、引用符で囲まれた範囲を別に数える。
const metaTagPattern = /<meta\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi

// 属性の名前と値。値は二重引用符、一重引用符、引用符なしの 3 つの形がある。
const attributePattern =
  /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g

const titleTagPattern = /<title\b[^>]*>([\s\S]*?)<\/title>/i

// HTML の実体参照のうち、meta の中身に現れるもの。数値参照は decodeEntities で別に扱う。
const namedEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  laquo: '«',
  raquo: '»',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  middot: '·',
  copy: '©',
  reg: '®',
  trade: '™',
  times: '×',
  szlig: 'ß',
}

export async function fetchOgp(url: string): Promise<Ogp | null> {
  const res = await fetch(url, {
    headers: {
      'user-agent': userAgent,
      accept: 'text/html,application/xhtml+xml',
      'accept-language': 'ja,en;q=0.8',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (!/text\/html|application\/xhtml/i.test(contentType)) {
    throw new Error(`HTML ではありません (${contentType || '種別の指定なし'})`)
  }

  const body = await res.arrayBuffer()
  // 相対パスの画像は、リダイレクト後の URL を基準に解決する。
  return parseOgp(decodeHtml(body, contentType), res.url || url)
}

export function parseOgp(html: string, url: string): Ogp {
  const meta = collectMeta(html)

  // og:title を持たないページのほうが少数だが、個人のサイトには残っている。title タグまで下りる。
  const title =
    meta.get('og:title') ??
    meta.get('twitter:title') ??
    extractTitle(html) ??
    url

  const description =
    meta.get('og:description') ??
    meta.get('twitter:description') ??
    meta.get('description') ??
    ''

  const image =
    meta.get('og:image') ??
    meta.get('og:image:url') ??
    meta.get('twitter:image') ??
    meta.get('twitter:image:src') ??
    null

  return {
    title,
    description,
    image: image === null ? null : resolveUrl(image, url),
  }
}

// meta タグを、property か name をキーとする表にまとめる。
// 同じキーが複数あるときは先に出たものを採る。og:image を複数持つページで、1 枚目が代表の画像になる。
function collectMeta(html: string): Map<string, string> {
  const meta = new Map<string, string>()
  for (const tag of html.matchAll(metaTagPattern)) {
    const attributes = collectAttributes(tag[1])
    const key = attributes.get('property') ?? attributes.get('name')
    const content = attributes.get('content')
    if (key === undefined || content === undefined) {
      continue
    }
    const value = normalize(content)
    if (value !== '' && !meta.has(key)) {
      meta.set(key, value)
    }
  }
  return meta
}

function collectAttributes(source: string): Map<string, string> {
  const attributes = new Map<string, string>()
  for (const attribute of source.matchAll(attributePattern)) {
    const name = attribute[1].toLowerCase()
    const value = attribute[2] ?? attribute[3] ?? attribute[4] ?? ''
    if (!attributes.has(name)) {
      attributes.set(name, value)
    }
  }
  return attributes
}

function extractTitle(html: string): string | null {
  const match = html.match(titleTagPattern)
  if (match === null) {
    return null
  }
  const title = normalize(match[1])
  return title === '' ? null : title
}

// 相対パスの画像を絶対 URL にする。解決できない値はカードから外す。
function resolveUrl(value: string, base: string): string | null {
  try {
    const resolved = new URL(value, base)
    return resolved.protocol === 'http:' || resolved.protocol === 'https:'
      ? resolved.toString()
      : null
  } catch {
    return null
  }
}

// 実体参照を戻し、改行と連続する空白を 1 つにまとめる。
// 改行は description に入っていることがあり、そのままだと JSON に \n が並ぶ。
function normalize(value: string): string {
  return decodeEntities(value).replace(/\s+/g, ' ').trim()
}

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]*);/gi, (entity, body) => {
    if (body.startsWith('#')) {
      const code = body.startsWith('#x')
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10)
      return Number.isNaN(code) ? entity : String.fromCodePoint(code)
    }
    return namedEntities[body.toLowerCase()] ?? entity
  })
}

// 応答のバイト列を文字列にする。
//
// 古い個人サイトには Shift_JIS や EUC-JP のページが残っていて、UTF-8 として読むとタイトルが文字化けする。
// 文字コードは Content-Type ヘッダ、無ければ HTML の中の meta から読む。
export function decodeHtml(body: ArrayBuffer, contentType: string): string {
  const bytes = new Uint8Array(body)
  const charset = charsetFromContentType(contentType) ?? charsetFromMeta(bytes)
  if (charset !== null) {
    try {
      return new TextDecoder(charset).decode(bytes)
    } catch {
      // 知らない名前を名乗るページがある。UTF-8 として読み直す。
    }
  }
  return new TextDecoder().decode(bytes)
}

function charsetFromContentType(contentType: string): string | null {
  const match = contentType.match(/charset\s*=\s*"?([\w-]+)"?/i)
  return match === null ? null : match[1]
}

// meta の charset は head の先頭に置く決まりなので、頭の 2KB だけ見る。
// バイト列をそのまま探すために latin1 として読む。1 バイトが 1 文字に対応し、どの文字コードでも ASCII の部分は保たれる。
function charsetFromMeta(bytes: Uint8Array): string | null {
  const head = new TextDecoder('latin1').decode(bytes.slice(0, 2048))
  const charset = head.match(/<meta\b[^>]*\bcharset\s*=\s*["']?([\w-]+)/i)
  return charset === null ? null : charset[1]
}
