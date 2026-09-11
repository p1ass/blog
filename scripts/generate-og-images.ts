#!/usr/bin/env node
// 記事の OG 画像を生成する。ビルドの最初に回し、public/posts/<slug>/og.png へ書き出す。
//
// 以前は og-image.p1ass.com という別のサービスが、共有されるたびにその場で生成していた。
// 記事の数は増えても 1 年に 10 本ほどで、しかもタイトルは公開したあと変わらない。
// ビルドのときに 1 度生成すれば済むものを、サービスを 1 つ立てて持ち続ける理由がない。
//
// 生成した画像はリポジトリにコミットする。ビルドの環境やフォントが変わって絵が動いたら、PR の差分で気づける。
// 基準画像を 36 枚コミットしている見た目の回帰テストと同じ考え方で、生成物を目で確かめられる場所に置く。
//
// ビルドのたびに生成し直すのは、生成し忘れを起きなくするため。public/ は vite がそのまま dist へコピーするので、
// vite より先に回せば、その回のビルドから新しい記事の画像が出る。
//
// frontmatter に ogImage がある記事は、そちらを使うので生成しない。
//
// 生成する中身は前のサービスと揃えてある。1200 × 630、白地、タイトル、左下にサイト名と URL、右下にアイコン、下辺に accent の帯。
// タイトルは左揃えで、上下の中央に置く。中央揃えにすると、行ごとに始まりの位置が変わって読み出しが探しづらい。
// 色はテーマの明るい側を参照する。OG 画像は SNS の白い枠の中に出るので、読者のテーマには従わない。

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { loadDefaultJapaneseParser } from 'budoux'
import satori from 'satori'
import { parse as parseYaml } from 'yaml'
import { frontmatterSchema } from '../app/routes/posts/types.ts'
import { light } from '../app/styles/theme.ts'

const postsDir = 'app/routes/posts'
const outDir = 'public/posts'
const fontDir = 'fonts'
const iconPath = 'public/static/icon.png'

const width = 1200
const height = 630
const padding = 80
const contentWidth = width - padding * 2

// タイトルの大きさ。長いタイトルほど落とす。
const titleSizes = [64, 56, 48, 40]

// タイトルに使ってよい高さ。これを超えると、下に置くサイト名の行と詰まって見える。
const maxTitleHeight = 300

const siteName = 'ぷらすのブログ'
const siteUrl = 'https://blog.p1ass.com'

const fontFamily = 'Gen Interface JP'

type Post = {
  slug: string
  title: string
  hasOwnImage: boolean
}

function collectPosts(): Post[] {
  const posts: Post[] = []
  for (const slug of readdirSync(postsDir)) {
    const path = join(postsDir, slug, 'index.mdx')
    let source: string
    try {
      source = readFileSync(path, 'utf-8')
    } catch {
      continue
    }
    const matched = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (matched === null) {
      throw new Error(`frontmatter がありません: ${path}`)
    }
    const frontmatter = frontmatterSchema.parse(parseYaml(matched[1]))
    posts.push({
      slug,
      title: frontmatter.title,
      hasOwnImage: frontmatter.ogImage !== undefined,
    })
  }
  return posts
}

// 和文は文節で折る。budoux が返す区切りを組み立てて、こちらで行を決める。
// satori に任せると、幅が尽きた場所でそのまま折り返して「参加し|て」のような切れ方になる。
// keep-all にするとゼロ幅スペースでも折り返さず、画像の外へはみ出す。
const parser = loadDefaultJapaneseParser()

// 文字幅の目安。em を単位にする。この書体の全角は 1em ちょうどで、欧文は字ごとに違うので大きめに見ておく。
// 概算で足りるのは、行の決め方を誤っても satori 側の折り返しが受け止めるため。
function charWidth(char: string): number {
  if (/[\u3000-\u30ff\u3400-\u9fff\uff00-\uffef]/.test(char)) {
    return 1
  }
  if (/[A-Z0-9@#&%]/.test(char)) {
    return 0.62
  }
  if (/[ilj.,:;'!|()[\]]/.test(char)) {
    return 0.28
  }
  if (/\s/.test(char)) {
    return 0.3
  }
  return 0.55
}

function textWidth(text: string): number {
  let width = 0
  for (const char of text) {
    width += charWidth(char)
  }
  return width
}

// 文節を順に詰めて、入らなくなったら次の行へ送る。
// 幅は概算なので、少し狭く見て詰め込みすぎを避ける。行が長すぎたときは satori が折る。
function composeLines(title: string, fontSize: number): string[] {
  const limit = (contentWidth * 0.95) / fontSize
  const lines: string[] = []
  let current = ''
  for (const phrase of parser.parse(title)) {
    if (current !== '' && textWidth(current + phrase) > limit) {
      lines.push(current)
      current = phrase
      continue
    }
    current += phrase
  }
  if (current !== '') {
    lines.push(current)
  }
  return lines
}

// タイトルの高さ。これを超えない中でいちばん大きい大きさを選ぶ。
// 高さは satori に測らせる。文字幅の概算で決めると、欧文の多いタイトルで 1 行増え、サイト名の行に重なる。
async function layoutTitle(
  title: string,
  fonts: Font[],
): Promise<{ text: string; fontSize: number }> {
  const last = titleSizes[titleSizes.length - 1]
  for (const fontSize of titleSizes) {
    const text = composeLines(title, fontSize).join('\n')
    if (fontSize === last) {
      return { text, fontSize }
    }
    const measured = await satori(titleBlock(text, fontSize) as SatoriNode, {
      width: contentWidth,
      fonts,
    })
    const height = Number(measured.match(/height="(\d+)"/)?.[1] ?? 0)
    if (height <= maxTitleHeight) {
      return { text, fontSize }
    }
  }
  throw new Error('titleSizes が空')
}

// satori に渡す要素。JSX は使わず素のオブジェクトで組む。
// この 1 ファイルのために JSX の設定を足すより、型どおりのオブジェクトを書くほうが短い。
type Element = {
  type: string
  props: Record<string, unknown> & { children?: Element | Element[] | string }
}

function element(
  type: string,
  style: Record<string, unknown>,
  children?: Element | Element[] | string,
): Element {
  return { type, props: { style, children } }
}

// satori はフォントを配列で受け取り、型は React の要素を求める。渡すのは同じ形の素のオブジェクトなので、その 2 つをここで名付けておく。
type Font = Parameters<typeof satori>[1]['fonts'][number]
type SatoriNode = Parameters<typeof satori>[0]

function titleBlock(text: string, fontSize: number): Element {
  return element(
    'div',
    {
      display: 'flex',
      width: `${contentWidth}px`,
      fontSize: `${fontSize}px`,
      fontWeight: 700,
      lineHeight: 1.4,
      color: light.text,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    text,
  )
}

function card(
  heading: { text: string; fontSize: number },
  icon: string,
): Element {
  return element(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: `${width}px`,
      height: `${height}px`,
      padding: `${padding}px`,
      backgroundColor: light.surface,
      borderBottom: `16px solid ${light.accent}`,
      fontFamily,
    },
    [
      element(
        'div',
        {
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        },
        titleBlock(heading.text, heading.fontSize),
      ),
      element(
        'div',
        {
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        },
        [
          element('div', { display: 'flex', flexDirection: 'column' }, [
            element(
              'div',
              { fontSize: '30px', color: light.text, marginBottom: '12px' },
              siteName,
            ),
            element(
              'div',
              { fontSize: '26px', color: light.textMuted },
              siteUrl,
            ),
          ]),
          { type: 'img', props: { src: icon, width: 88, height: 88 } },
        ],
      ),
    ],
  )
}

async function main() {
  const fonts: Font[] = [
    {
      name: fontFamily,
      weight: 400 as const,
      style: 'normal' as const,
      data: readFileSync(join(fontDir, 'GenInterfaceJP-Regular.ttf')),
    },
    {
      name: fontFamily,
      weight: 700 as const,
      style: 'normal' as const,
      data: readFileSync(join(fontDir, 'GenInterfaceJP-Bold.ttf')),
    },
  ]
  const icon = `data:image/png;base64,${readFileSync(iconPath).toString('base64')}`

  const posts = collectPosts()
  let generated = 0
  for (const post of posts) {
    if (post.hasOwnImage) {
      continue
    }
    const heading = await layoutTitle(post.title, fonts)
    const svg = await satori(card(heading, icon) as SatoriNode, {
      width,
      height,
      fonts,
    })
    // 文字は satori がすでにパスへ変換しているので、フォントは要らない。
    // 既定では OS のフォントを全部読みに行き、1 枚あたり 0.3 秒ほど余計にかかる。
    const png = new Resvg(svg, { font: { loadSystemFonts: false } })
      .render()
      .asPng()
    mkdirSync(join(outDir, post.slug), { recursive: true })
    writeFileSync(join(outDir, post.slug, 'og.png'), png)
    generated++
  }

  console.log(
    `OG 画像を ${generated} 件生成しました (frontmatter の ogImage を持つ ${posts.length - generated} 件は対象外)`,
  )
}

await main()
