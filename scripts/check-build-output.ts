// @hono/vite-ssg はルートが例外を投げても index.txt を書き出してビルドを成功させるので、記事ごとに index.html があるか確かめる。
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const postsDir = 'dist/posts'

const allowedElements = new Map([
  ['p', '_renderer.tsx のグローバル'],
  ['h2', '_renderer.tsx のグローバル。article の中だけ章のボーダーが付く'],
  ['h3', '_renderer.tsx のグローバル'],
  ['h4', '_renderer.tsx のグローバル'],
  ['h5', '_renderer.tsx のグローバル。本文と同じ大きさで太さだけ変える'],
  ['h6', '_renderer.tsx のグローバル。本文と同じ大きさで太さだけ変える'],
  ['a', 'styles/link.ts の bodyLinkCss'],
  ['img', 'mdx-components.tsx の Image'],
  ['ul', '_renderer.tsx のグローバル'],
  ['ol', '_renderer.tsx のグローバル'],
  ['li', '_renderer.tsx のグローバル'],
  ['strong', 'ブラウザ既定の太字'],
  ['em', 'mdx-components.tsx の Em。画像のキャプションとして使っている'],
  ['del', 'ブラウザ既定の打ち消し線'],
  ['code', '_renderer.tsx のグローバル。code.hljs で上書きする'],
  ['pre', '_renderer.tsx のグローバル'],
  ['blockquote', 'mdx-components.tsx の BlockQuote'],
  ['hr', '_renderer.tsx のグローバル'],
  ['br', 'スタイル不要'],
  ['table', 'mdx-components.tsx の Table。横スクロールするラッパーで囲む'],
  ['thead', 'スタイル不要'],
  ['tbody', 'スタイル不要'],
  ['tr', 'mdx-components.tsx の tableCss で縞にする'],
  ['th', 'mdx-components.tsx の Th'],
  ['td', 'mdx-components.tsx の Td'],
  ['sup', '_renderer.tsx のグローバル。脚注の参照'],
  ['section', '_renderer.tsx の .footnotes。脚注のまとまり'],
  ['aside', 'Note コンポーネント'],
  ['details', '_renderer.tsx のグローバル'],
  ['summary', '_renderer.tsx のグローバル'],
  ['div', 'ラッパー。リンクカード、表、Note のアイコンなど'],
  ['span', 'highlight.js の色分けと、リンクカードのホスト名'],
  ['i', 'ブラウザ既定の斜体。記事の中で生の HTML として 1 箇所だけ使っている'],
  [
    'svg',
    'Mermaid の図と、Note のアイコン。図のほうは _renderer.tsx の article > svg で中央に置く',
  ],
  ['iframe', '外部の埋め込み。中身は向こうのページなのでスタイルを当てない'],
  ['script', '外部の埋め込みが読み込むスクリプト。描画しない'],
  ['style', 'Mermaid が図ごとに書き出すスタイル。描画しない'],
])

// svg の中は Mermaid と埋め込みの領域で、foreignObject に div や span も入るので、部分木ごと数えない。
function elementsOutsideSvg(html: string): Set<string> {
  const found = new Set<string>()
  let depth = 0
  for (const match of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/g)) {
    const [, slash, rawName] = match
    const name = rawName.toLowerCase()
    if (name === 'svg') {
      if (slash) {
        depth -= 1
      } else {
        depth += 1
        found.add(name)
      }
      continue
    }
    if (depth === 0 && !slash) {
      found.add(name)
    }
  }
  return found
}

const missingIndex: string[] = []
const missingOgImage: string[] = []
const unknownElements: string[] = []

const siteUrl = 'https://blog.p1ass.com'

for (const slug of readdirSync(postsDir)) {
  const dir = join(postsDir, slug)
  if (!statSync(dir).isDirectory()) {
    continue
  }
  const entries = readdirSync(dir)
  if (!entries.includes('index.html')) {
    missingIndex.push(`${slug}: index.html が無い (${entries.join(', ')})`)
    continue
  }

  const html = readFileSync(join(dir, 'index.html'), 'utf8')

  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)
  if (!ogImage) {
    missingOgImage.push(`${slug}: og:image が無い`)
  } else if (!existsSync(join('dist', ogImage[1].replace(siteUrl, '')))) {
    missingOgImage.push(`${slug}: ${ogImage[1]} の実体が無い`)
  }

  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/)
  if (!article) {
    unknownElements.push(`${slug}: article 要素が無い`)
    continue
  }

  const unknown = [...elementsOutsideSvg(article[1])].filter(
    name => !allowedElements.has(name),
  )
  if (unknown.length > 0) {
    unknownElements.push(`${slug}: ${unknown.join(', ')}`)
  }
}

const missingNotFound = !existsSync('dist/404.html')
if (missingNotFound) {
  console.error(
    'dist/404.html がありません。app/routes/404.tsx を確かめてください。',
  )
}

if (missingIndex.length > 0) {
  console.error('ビルド結果に欠けている記事があります:')
  for (const failure of missingIndex) {
    console.error(`  ${failure}`)
  }
}

if (missingOgImage.length > 0) {
  console.error('og:image が指すファイルがありません:')
  for (const failure of missingOgImage) {
    console.error(`  ${failure}`)
  }
  console.error(
    'frontmatter の ogImage を書いた記事はその画像を、それ以外は scripts/generate-og-images.ts の生成物を確かめてください。',
  )
}

if (unknownElements.length > 0) {
  console.error('一覧に無い要素が記事本文に出ています:')
  for (const failure of unknownElements) {
    console.error(`  ${failure}`)
  }
  console.error(
    'スタイルを当ててから scripts/check-build-output.ts の allowedElements に足してください。',
  )
}

if (
  missingNotFound ||
  missingIndex.length > 0 ||
  missingOgImage.length > 0 ||
  unknownElements.length > 0
) {
  process.exit(1)
}

console.log(
  `記事 ${readdirSync(postsDir).length} 件すべてに index.html と OG 画像があり、本文の要素は ${allowedElements.size} 種類の一覧に収まっています`,
)
