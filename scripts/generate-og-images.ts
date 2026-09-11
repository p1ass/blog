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
import { tokenize } from 'kuromojin'
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

const titleLineHeight = 1.4

// 行を組むときに使う幅の割合。概算が外れて satori に折り返されたら、順に下げて組み直す。
const widthRatios = [0.98, 0.94, 0.9, 0.86, 0.82]

// タイトルに使ってよい高さ。
// 上下の余白が 80、下辺の帯が 16、サイト名と URL の 2 行が 105 で、残りは 350 ほどある。
// そこから少しだけ引いて、サイト名の行と詰まって見えないようにする。
const maxTitleHeight = 340

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

// 折り返してよい単位に切る。
//
// 単位は語にする。budoux が返すのは文節なので、「ソフトウェアエンジニア職で」のような塊がそのまま残り、
// これだけで行を組むと 1 行が長くなりすぎて前後の行が極端に短くなる。
// kuromoji で語に割れば、「ソフトウェア」「エンジニア」「職」「で」の切れ目でも折り返せる。
//
// 切れ目には良し悪しがある。文節の切れ目がいちばん自然で、語の切れ目がその次になる。
// その差を penalty に持たせて、行の決め方で重みを付ける。
type Unit = {
  text: string
  width: number
  penalty: number
}

// 文節の切れ目。budoux が返した区切りなので、ここで折るのが最も自然になる。
const phraseBreak = 0

// 語の切れ目。文節の中で折ることになる。2em ぶんの余りを埋められるなら許す。
const wordBreak = 4

// 語の途中。「エンジ|ニアリング」のような切れ方になるので、1 行に収まらない語だけに許す。
const insideWordBreak = 25

// 行頭に置けない文字。句読点と閉じ括弧、長音符、小書きの仮名。
const forbiddenAtLineStart =
  /^[、。，．・：；！？）］｝」』】〉》〕ゝ々ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ]/

// 行末に置けない文字。開き括弧。
const forbiddenAtLineEnd = /[（［｛「『【〈《〔]$/

// 空白を挟まずに続く欧文と記号。kuromoji は "Next.js" を Next と . と js に割るので、つなぎ直す。
const asciiWord = /[0-9A-Za-z./_#@&%+:~-]/

// タイトルを語の並びにする。
//
// 空白は直前の語にくっつける。単独の単位にすると、行頭に空白の来る組み方が生まれる。
//
// 空白で区切られていない欧文はひとつながりのままにする。"Next.js" や "Browser-Based" が割れると読めなくなる。
async function splitIntoUnits(title: string): Promise<Unit[]> {
  // 文節の先頭にあたる位置。ここで折るときだけ penalty を 0 にする。
  const phraseHeads = new Set<number>()
  let head = 0
  for (const phrase of parser.parse(title)) {
    phraseHeads.add(head)
    head += phrase.length
  }

  const units: Unit[] = []
  let position = 0
  for (const token of await tokenize(title)) {
    const text = token.surface_form
    const previous = units[units.length - 1]
    const continuesAscii =
      previous !== undefined &&
      asciiWord.test(previous.text.slice(-1)) &&
      asciiWord.test(text.slice(0, 1))
    if (previous !== undefined && (/^\s+$/.test(text) || continuesAscii)) {
      previous.text += text
      previous.width += textWidth(text)
    } else {
      units.push({
        text,
        width: textWidth(text),
        penalty: phraseHeads.has(position) ? phraseBreak : wordBreak,
      })
    }
    position += text.length
  }
  return units
}

// 1 行に収まらない語を 1 文字ずつに割る。
//
// 「ソフトウェアエンジニアリングインターン」のように、辞書に無い長いカタカナ語は 1 語のまま出てくる。
// 割らないと、その語だけの行と、前後の極端に短い行ができる。
function splitOverflowing(units: Unit[], limit: number): Unit[] {
  return units.flatMap(unit => {
    if (
      unit.width <= limit ||
      /^[^\u3000-\u30ff\u3400-\u9fff\uff00-\uffef]+$/.test(unit.text)
    ) {
      return unit
    }
    return [...unit.text].map((char, index) => ({
      text: char,
      width: charWidth(char),
      penalty: index === 0 ? unit.penalty : insideWordBreak,
    }))
  })
}

// 行を組む。どこで折るかを、費用がいちばん小さくなる組み合わせで決める。
//
// 費用は 2 つある。1 つは行の余りの 2 乗で、足し合わせると行の長さが揃う。
// もう 1 つが切れ目の penalty で、文節の切れ目を語の切れ目より優先させる。
//
// 貪欲に詰めるだけだと、最後の行に「試した」の 3 文字だけが残るような形になる。
//
// ratio は幅をどれだけ使うか。概算が外れて satori に折り返されたときは、呼び出す側がこれを下げて組み直す。
function composeLines(
  allUnits: Unit[],
  fontSize: number,
  ratio: number,
): string[] {
  const limit = (contentWidth * ratio) / fontSize
  const units = splitOverflowing(allUnits, limit)
  const count = units.length

  // best は、その位置から先を組んだときの最小の費用。next は、そのときの次の行の始まり。
  const best = new Array<number>(count + 1).fill(Number.POSITIVE_INFINITY)
  const next = new Array<number>(count + 1).fill(count)
  best[count] = 0

  for (let start = count - 1; start >= 0; start--) {
    let width = 0
    for (let end = start; end < count; end++) {
      width += units[end].width
      // 1 単位だけで幅を超える行は許す。それ以上は切れないので、satori の折り返しに任せる。
      if (width > limit && end > start) {
        break
      }
      if (end + 1 < count && !canBreakBetween(units[end], units[end + 1])) {
        continue
      }
      const slack = Math.max(limit - width, 0)
      const penalty = end + 1 < count ? units[end + 1].penalty : 0
      const cost = slack * slack + penalty + best[end + 1]
      if (cost < best[start]) {
        best[start] = cost
        next[start] = end + 1
      }
    }
  }

  const lines: string[] = []
  for (let start = 0; start < count; start = next[start]) {
    lines.push(
      units
        .slice(start, next[start])
        .map(unit => unit.text)
        .join('')
        .trim(),
    )
  }
  return lines
}

// 禁則処理。句点や閉じ括弧を行頭に置かず、開き括弧を行末に残さない。
function canBreakBetween(before: Unit, after: Unit): boolean {
  return (
    !forbiddenAtLineStart.test(after.text) &&
    !forbiddenAtLineEnd.test(before.text)
  )
}

// タイトルの組み方を決める。行はこちらで組み立て、決めた改行を satori へ渡す。
//
// 大きさは satori に測らせて選ぶ。文字幅の概算で決めると、欧文の多いタイトルで 1 行増え、サイト名の行に重なる。
//
// 測った高さは、組んだ行数の確かめにも使う。
// 概算が外れて 1 行が長すぎると satori がそこをさらに折り返し、「エンジニア職で」の「で」だけが次の行に残る。
// 行数が合わないあいだは、幅の見積もりを下げて組み直す。
async function layoutTitle(
  title: string,
  fonts: Font[],
): Promise<{ text: string; fontSize: number }> {
  const units = await splitIntoUnits(title)
  // 行数が合った組み方のうち、いちばん小さいもの。どの大きさでも高さへ収まらなかったときに使う。
  let narrowest: { text: string; fontSize: number } | null = null

  for (const fontSize of titleSizes) {
    for (const ratio of widthRatios) {
      const lines = composeLines(units, fontSize, ratio)
      const text = lines.join('\n')
      const height = await measureTitleHeight(text, fontSize, fonts)
      if (Math.round(height / (fontSize * titleLineHeight)) > lines.length) {
        continue
      }
      narrowest = { text, fontSize }
      if (height <= maxTitleHeight) {
        return narrowest
      }
      // 行数は合っているが高さが足りない。幅を狭めても行が増えるだけなので、次の大きさへ移る。
      break
    }
  }

  return (
    narrowest ?? { text: title, fontSize: titleSizes[titleSizes.length - 1] }
  )
}

// タイトルだけを描かせて高さを測る。satori は width だけ渡すと、高さを中身から決める。
async function measureTitleHeight(
  text: string,
  fontSize: number,
  fonts: Font[],
): Promise<number> {
  const svg = await satori(titleBlock(text, fontSize) as SatoriNode, {
    width: contentWidth,
    fonts,
  })
  return Number(svg.match(/height="(\d+)"/)?.[1] ?? 0)
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
      lineHeight: titleLineHeight,
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
    console.error(
      `${heading.fontSize}px ${post.slug}: ${heading.text
        .split('\n')
        .map(l => `[${l}]`)
        .join(' ')}`,
    )
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
