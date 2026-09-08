// CSS に生の値が書かれていないか確かめる。
//
// トークンを定義しても、コンポーネントの側が生の値を書けば意味がない。
// 既存のコードを真似て新しいコンポーネントを書くとき、真似た先が生の値なら、そこから同じ値が増えていく。
// 読んで気づく形では止まらないので、機械で落とす。
//
// 見るのは css`` と keyframes`` の中身と、JSX の style 属性だけ。
// 日本語のコメントや本文にも px や #4172b5 は出てくるが、それは説明であって描画には反映されない。
// ファイル全体を正規表現で見るとこの区別が付かないため、TypeScript のパーサで CSS の位置だけを取り出す。
import { globSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// トークンそのものを定義するファイル。ここでしか生の値を書けない。
//
// 「どこに書いてよいか」を 1 箇所に集めるのが目的なので、app/styles/ をまとめて外すのではなく
// ファイルごとに理由を書く。理由を書けないファイルは、生の値を持つべきではない。
const tokenSources = new Map([
  ['app/styles/palette.ts', 'カラーの値そのもの'],
  ['app/styles/brand.ts', '他社のブランドカラー。こちらでは決められない'],
  [
    'app/styles/highlight.ts',
    'highlight.js のテーマ。配布物の色をそのまま持つ',
  ],
  ['app/styles/typography.ts', 'フォントサイズと下線の定義'],
  ['app/styles/spacing.ts', 'スペーシングの定義'],
  ['app/styles/shape.ts', '角丸、ボーダーの太さ、フォーカスリングの定義'],
  [
    'app/styles/breakpoint.ts',
    'ブレークポイントと本文幅の定義。mediaUp もここ',
  ],
  ['app/styles/motion.ts', 'モーションの定義。reducedMotion もここ'],
  [
    'app/styles/theme.ts',
    '役割への割り当て。prefers-color-scheme の分岐もここ',
  ],
])

// 寸法にトークンを持つプロパティと、その引き先。
//
// width や height のような、コンポーネントひとつの都合で決まる寸法は見ない。
// アバターの 80px やリンクカードのサムネイルの高さに共通の基準はなく、トークンにしても引く先が 1 箇所にしかない。
// 見るのはページ全体のリズムを決めるものだけに絞る。
const tokenizedProperties = new Map([
  ['font-size', 'typography.ts の fontSize'],
  ['padding', 'spacing.ts の space'],
  ['padding-top', 'spacing.ts の space'],
  ['padding-right', 'spacing.ts の space'],
  ['padding-bottom', 'spacing.ts の space'],
  ['padding-left', 'spacing.ts の space'],
  ['margin', 'spacing.ts の space か blockGap'],
  ['margin-top', 'spacing.ts の space か blockGap'],
  ['margin-right', 'spacing.ts の space か blockGap'],
  ['margin-bottom', 'spacing.ts の space か blockGap'],
  ['margin-left', 'spacing.ts の space か blockGap'],
  ['gap', 'spacing.ts の space'],
  ['row-gap', 'spacing.ts の space'],
  ['column-gap', 'spacing.ts の space'],
  ['border-radius', 'shape.ts の radius'],
  ['border', 'shape.ts の borderWidth'],
  ['border-top', 'shape.ts の borderWidth'],
  ['border-right', 'shape.ts の borderWidth'],
  ['border-bottom', 'shape.ts の borderWidth'],
  ['border-left', 'shape.ts の borderWidth'],
  ['border-width', 'shape.ts の borderWidth'],
  ['border-top-width', 'shape.ts の borderWidth'],
  ['border-right-width', 'shape.ts の borderWidth'],
  ['border-bottom-width', 'shape.ts の borderWidth'],
  ['border-left-width', 'shape.ts の borderWidth'],
  ['outline', 'shape.ts の focusRing'],
  ['outline-width', 'shape.ts の focusRing'],
  ['outline-offset', 'shape.ts の focusRing'],
  ['max-width', 'breakpoint.ts の contentWidth'],
  ['min-width', 'breakpoint.ts の contentWidth'],
  ['text-decoration-thickness', 'typography.ts の underline'],
  ['text-underline-offset', 'typography.ts の underline'],
])

// トークンで書けない箇所。理由を必ず書く。
//
// 印を CSS のコメントとして埋め込む形は採らなかった。hono/css の最小化はコメントを残すので、
// 理由の文がそのまま全ページの CSS に乗る。ここに置けば出力は変わらず、一覧としても読める。
//
// ファイルと種別と値で照合する。行番号で持つと、無関係な行を足しただけでずれる。
// 使われなかった項目があれば落とす。直したのに残った項目は、次に同じ値を書いたときの抜け道になる。
type Exception = {
  file: string
  rule: string
  value: string
  reason: string
}

const exceptions: Exception[] = [
  {
    file: 'app/components/ShareIcons.tsx',
    rule: 'box-shadow',
    value: 'box-shadow',
    reason:
      '影ではなく、円の内側に描く輪郭と hover の塗り。border だと円の大きさが変わる',
  },
  {
    file: 'app/components/ShareIcons.tsx',
    rule: 'padding-bottom',
    value: '1px',
    reason:
      '𝕏 と B! の字面を円の中心へ寄せる微調整。スペーシングの段には乗らない',
  },
  {
    file: 'app/routes/_renderer.tsx',
    rule: 'font-size',
    value: '0.85em',
    reason:
      'インラインコードは地の文に対する相対値。見出しの中でも周りの文字に追従させる',
  },
  {
    file: 'app/routes/_renderer.tsx',
    rule: 'padding',
    value: '2px',
    reason:
      'インラインコードの詰め。4px の段に乗せると行が高くなり、地の文の行送りが崩れる',
  },
  {
    file: 'app/routes/_renderer.tsx',
    rule: 'padding',
    value: '6px',
    reason: '同上。左右は上下との釣り合いで決めた',
  },
  {
    file: 'app/routes/_renderer.tsx',
    rule: 'min-width',
    value: '240px',
    reason: 'テーマの一覧の幅。項目の文字数で決まるので、本文幅とは無関係',
  },
]

const lengthPattern = /(?<![\w.#-])\d+(?:\.\d+)?(?:px|rem|em)\b/g
const hexPattern = /#[0-9a-fA-F]{3,8}\b/g
const mediaPattern = /@media\b/g

// プロパティと値の組。@media (min-width: ...) のような括弧の中を拾わないよう、直前の 1 文字を見る。
const declarationPattern = /(^|[^\w(-])([a-z][a-z-]*)\s*:\s*([^;{}]*)/g

const cssTags = new Set(['css', 'keyframes'])

type Range = [start: number, end: number]

type RawValue = {
  offset: number
  value: string
  rule: string
  hint: string
}

// css`` と keyframes`` の中身と、JSX の style 属性の位置を集める。
function cssRanges(sourceFile: ts.SourceFile): Range[] {
  const ranges: Range[] = []

  const visit = (node: ts.Node) => {
    if (
      ts.isTaggedTemplateExpression(node) &&
      ts.isIdentifier(node.tag) &&
      cssTags.has(node.tag.text)
    ) {
      ranges.push([node.template.getStart(sourceFile), node.template.getEnd()])
    }

    if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'style' &&
      node.initializer
    ) {
      ranges.push([
        node.initializer.getStart(sourceFile),
        node.initializer.getEnd(),
      ])
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return ranges
}

// ${...} で差し込む式を CSS として読まない。
// transition(['box-shadow']) のように、プロパティ名を文字列で渡すだけの呼び出しが引っかかる。
function substitutionRanges(sourceFile: ts.SourceFile): Range[] {
  const ranges: Range[] = []

  const visit = (node: ts.Node) => {
    if (ts.isTemplateSpan(node)) {
      ranges.push([
        node.expression.getStart(sourceFile),
        node.expression.getEnd(),
      ])
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return ranges
}

function findAll(text: string, pattern: RegExp) {
  pattern.lastIndex = 0
  return [...text.matchAll(pattern)].map(match => ({
    offset: match.index,
    value: match[0],
  }))
}

// CSS の中から、トークンで書くべき値を拾う。位置は渡した文字列の先頭からの相対値。
function rawValues(css: string): RawValue[] {
  const found: RawValue[] = []

  for (const hex of findAll(css, hexPattern)) {
    found.push({
      ...hex,
      rule: 'hex',
      hint: 'color.ts の役割名を使ってください。値を足すなら palette.ts へ',
    })
  }

  for (const media of findAll(css, mediaPattern)) {
    found.push({
      ...media,
      rule: '@media',
      hint: 'breakpoint.ts の mediaUp か motion.ts の reducedMotion を通してください',
    })
  }

  declarationPattern.lastIndex = 0
  for (const declaration of css.matchAll(declarationPattern)) {
    const [whole, prefix, property, value] = declaration

    if (property === 'box-shadow') {
      found.push({
        offset: declaration.index + prefix.length,
        value: property,
        rule: 'box-shadow',
        hint: '階層はボーダーと面のカラーで作ります。影は使いません',
      })
      continue
    }

    const source = tokenizedProperties.get(property)
    if (!source) {
      continue
    }
    // 値はプロパティ名の後ろに続く残り全部なので、宣言の末尾から数えて位置が出る。
    const valueOffset = declaration.index + whole.length - value.length
    for (const length of findAll(value, lengthPattern)) {
      found.push({
        offset: valueOffset + length.offset,
        value: length.value,
        rule: property,
        hint: `${source} を使ってください`,
      })
    }
  }

  return found
}

function inAnyRange(position: number, ranges: Range[]): boolean {
  return ranges.some(([start, end]) => position >= start && position < end)
}

export type Violation = {
  file: string
  line: number
  rule: string
  value: string
  hint: string
  code: string
}

// 1 ファイルぶんのチェック。呼ぶ側がファイルを読む形にしてあるのは、テストから文字列だけを渡せるようにするため。
export function findViolations(file: string, source: string): Violation[] {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )

  const skipped = substitutionRanges(sourceFile)
  const lines = source.split('\n')
  const found: Violation[] = []

  for (const [start, end] of cssRanges(sourceFile)) {
    for (const raw of rawValues(source.slice(start, end))) {
      const position = start + raw.offset
      if (inAnyRange(position, skipped)) {
        continue
      }
      const { line } = ts.getLineAndCharacterOfPosition(sourceFile, position)
      found.push({
        file,
        line: line + 1,
        rule: raw.rule,
        value: raw.value,
        hint: raw.hint,
        code: lines[line].trim(),
      })
    }
  }

  return found
}

function main() {
  const files = globSync('app/**/*.{ts,tsx}').sort()
  const violations: Violation[] = []
  const usedExceptions = new Set<Exception>()
  let checkedFiles = 0

  for (const file of files) {
    if (tokenSources.has(file) || file.endsWith('.test.ts')) {
      continue
    }
    checkedFiles += 1

    for (const violation of findViolations(file, readFileSync(file, 'utf-8'))) {
      const exception = exceptions.find(
        candidate =>
          candidate.file === violation.file &&
          candidate.rule === violation.rule &&
          candidate.value === violation.value,
      )
      if (exception) {
        usedExceptions.add(exception)
        continue
      }
      violations.push(violation)
    }
  }

  const staleExceptions = exceptions.filter(
    exception => !usedExceptions.has(exception),
  )

  if (violations.length > 0) {
    console.error('CSS に生の値が書かれています:')
    for (const violation of violations) {
      console.error(
        `  ${violation.file}:${violation.line} [${violation.rule}] ${violation.value}`,
      )
      console.error(`    ${violation.code}`)
      console.error(`    → ${violation.hint}`)
    }
    console.error(
      'トークンにできない事情があるときは、scripts/check-style-tokens.ts の exceptions に理由を書いて足してください。',
    )
  }

  if (staleExceptions.length > 0) {
    console.error(
      'scripts/check-style-tokens.ts の exceptions に余りがあります:',
    )
    for (const exception of staleExceptions) {
      console.error(
        `  ${exception.file} [${exception.rule}] ${exception.value} — ${exception.reason}`,
      )
    }
    console.error('該当の値がもう無いので、この項目を消してください。')
  }

  if (violations.length > 0 || staleExceptions.length > 0) {
    process.exit(1)
  }

  console.log(
    `${checkedFiles} ファイルの CSS に生の値はありません (理由を書いて許した箇所 ${exceptions.length} 件、定義元 ${tokenSources.size} ファイルは対象外)`,
  )
}

// テストからは findViolations だけを呼ぶ。読み込んだだけで全ファイルを見に行かないよう、実行のときだけ main に入る。
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
