export type Ogp = {
  title: string
  description: string
  image: string | null
}

// User-Agent を送らない要求を弾くサイトがある。
const userAgent =
  'Mozilla/5.0 (compatible; p1ass-blog-ogp/1.0; +https://blog.p1ass.com/)'

const timeoutMs = 15_000

// 属性値の中の > で切らないよう、引用符で囲まれた範囲を別に数える。
const metaTagPattern = /<meta\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi

const attributePattern =
  /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g

const titleTagPattern = /<title\b[^>]*>([\s\S]*?)<\/title>/i

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
  return parseOgp(decodeHtml(body, contentType), res.url || url)
}

export function parseOgp(html: string, url: string): Ogp {
  const meta = collectMeta(html)

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

export function decodeHtml(body: ArrayBuffer, contentType: string): string {
  const bytes = new Uint8Array(body)
  const charset = charsetFromContentType(contentType) ?? charsetFromMeta(bytes)
  if (charset !== null) {
    try {
      return new TextDecoder(charset).decode(bytes)
    } catch {}
  }
  return new TextDecoder().decode(bytes)
}

function charsetFromContentType(contentType: string): string | null {
  const match = contentType.match(/charset\s*=\s*"?([\w-]+)"?/i)
  return match === null ? null : match[1]
}

// どの文字コードでも ASCII の部分を保ったままバイト列を探せるよう、latin1 として読む。
function charsetFromMeta(bytes: Uint8Array): string | null {
  const head = new TextDecoder('latin1').decode(bytes.slice(0, 2048))
  const charset = head.match(/<meta\b[^>]*\bcharset\s*=\s*["']?([\w-]+)/i)
  return charset === null ? null : charset[1]
}
