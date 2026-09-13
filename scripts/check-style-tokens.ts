// ファイル全体を正規表現で見るとコメントの px や #hex まで拾うので、TypeScript のパーサで CSS の位置だけを取り出す。
import { globSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

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

// width や height のようなコンポーネント固有の寸法は共通の基準がないので見ない。
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

// CSS のコメントに理由を書くと最小化後も全ページの CSS に残るので、例外はここに集める。
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

// @media (min-width: ...) の括弧の中を拾わないよう、直前の 1 文字を見る。
const declarationPattern = /(^|[^\w(-])([a-z][a-z-]*)\s*:\s*([^;{}]*)/g

const cssTags = new Set(['css', 'keyframes'])

type Range = [start: number, end: number]

type RawValue = {
  offset: number
  value: string
  rule: string
  hint: string
}

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

// transition(['box-shadow']) のようにプロパティ名を文字列で渡す呼び出しを拾わないよう、${...} の中は読まない。
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

// テストから import されたときに全ファイルを読みに行かないよう、直接実行されたときだけ main に入る。
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
