#!/usr/bin/env node
// OG 画像は SNS の白い枠の中に出るので、読者のテーマではなく明るいテーマの色で描画する。

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

const titleSizes = [64, 56, 48, 40]

const titleLineHeight = 1.4

const widthRatios = [0.98, 0.94, 0.9, 0.86, 0.82]

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

// satori に折り返しを任せると「参加し|て」のように切れるので、改行はこちらで決める。
const parser = loadDefaultJapaneseParser()

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

type Unit = {
  text: string
  width: number
  penalty: number
}

const phraseBreak = 0

const wordBreak = 4

const insideWordBreak = 25

const forbiddenAtLineStart =
  /^[、。，．・：；！？）］｝」』】〉》〕ゝ々ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ]/

const forbiddenAtLineEnd = /[（［｛「『【〈《〔]$/

// kuromoji は Next.js を Next と . と js に割るので、つなぎ直す。
const asciiWord = /[0-9A-Za-z./_#@&%+:~-]/

async function splitIntoUnits(title: string): Promise<Unit[]> {
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

// 貪欲に詰めると最後の行に数文字だけ残るので、行の余りの 2 乗と切れ目の penalty の合計が最小になる組み方を選ぶ。
function composeLines(
  allUnits: Unit[],
  fontSize: number,
  ratio: number,
): string[] {
  const limit = (contentWidth * ratio) / fontSize
  const units = splitOverflowing(allUnits, limit)
  const count = units.length

  const best = new Array<number>(count + 1).fill(Number.POSITIVE_INFINITY)
  const next = new Array<number>(count + 1).fill(count)
  best[count] = 0

  for (let start = count - 1; start >= 0; start--) {
    let width = 0
    for (let end = start; end < count; end++) {
      width += units[end].width
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

function canBreakBetween(before: Unit, after: Unit): boolean {
  return (
    !forbiddenAtLineStart.test(after.text) &&
    !forbiddenAtLineEnd.test(before.text)
  )
}

// 文字幅は概算なので、satori に描画させた高さで行数を確かめ、合わなければ幅を狭めて組み直す。
async function layoutTitle(
  title: string,
  fonts: Font[],
): Promise<{ text: string; fontSize: number }> {
  const units = await splitIntoUnits(title)
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
      break
    }
  }

  return (
    narrowest ?? { text: title, fontSize: titleSizes[titleSizes.length - 1] }
  )
}

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
    // 文字は satori がパスにしているので、OS のフォントを読み込ませない。
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
