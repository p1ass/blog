import { createLinter, loadTextlintrc } from 'textlint'
import { beforeAll, describe, expect, it } from 'vitest'

// 実際の .textlintrc.json を読んで回す。プラグインの解決とルールの組み合わせまで検証したい。
const SPACING = 'ja-spacing/ja-space-between-half-and-full-width'
const JOSHI = 'ja-technical-writing/no-doubled-joshi'
const EXCLAMATION = 'ja-technical-writing/no-exclamation-question-mark'

// 半角と全角の間にスペースが無いので SPACING が出る。位置の検証にも使う。
const SPACING_SENTENCE = '本番ビルドではviteが動く'

type Finding = { ruleId: string; line: number; column: number }

let lint: (code: string, filePath: string) => Promise<Finding[]>
let fix: (code: string, filePath: string) => Promise<string>

beforeAll(async () => {
  const descriptor = await loadTextlintrc({
    configFilePath: '.textlintrc.json',
  })
  const linter = createLinter({ descriptor })
  lint = async (code, filePath) => {
    const result = await linter.lintText(code, filePath)
    return result.messages.map(message => ({
      ruleId: message.ruleId,
      line: message.line,
      column: message.column,
    }))
  }
  fix = async (code, filePath) => {
    const result = await linter.fixText(code, filePath)
    return result.output
  }
  // kuromoji の辞書読み込みを最初の 1 回でここに寄せる
  await lint('// ウォームアップ\n', 'warmup.ts')
}, 60_000)

const ruleIds = (findings: Finding[]) => [
  ...new Set(findings.map(finding => finding.ruleId)),
]

describe('コメントの拾い方', () => {
  it('行コメントの日本語を検査する', async () => {
    const findings = await lint(`// ${SPACING_SENTENCE}\n`, 'test.ts')
    expect(ruleIds(findings)).toEqual([SPACING])
  })

  it('ブロックコメントの * を本文から外す', async () => {
    const code = ['/**', ` * ${SPACING_SENTENCE}`, ' */', ''].join('\n')
    const findings = await lint(code, 'test.ts')
    expect(ruleIds(findings)).toEqual([SPACING])
    expect(findings.every(finding => finding.line === 2)).toBe(true)
  })

  it('閉じ括弧の直前にあるコメントも拾う', async () => {
    const code = [
      'const config = {',
      '  value: 1,',
      `  // ${SPACING_SENTENCE}`,
      '}',
      '',
    ].join('\n')
    const findings = await lint(code, 'test.ts')
    expect(ruleIds(findings)).toEqual([SPACING])
  })

  it('文字列リテラルは検査しない', async () => {
    expect(await lint(`const a = '${SPACING_SENTENCE}'\n`, 'test.ts')).toEqual(
      [],
    )
  })

  it('JSX のテキストは検査しない', async () => {
    expect(
      await lint(`const a = <p>${SPACING_SENTENCE}</p>\n`, 'test.tsx'),
    ).toEqual([])
  })

  it('日本語を含まないコメントは検査しない', async () => {
    const findings = await lint('// Do not touch this!\n', 'test.ts')
    expect(findings.map(finding => finding.ruleId)).not.toContain(EXCLAMATION)
    expect(findings).toEqual([])
  })

  it('機械向けのディレクティブは検査しない', async () => {
    const code = `// biome-ignore lint/style/noVar: ${SPACING_SENTENCE}\n`
    expect(await lint(code, 'test.ts')).toEqual([])
  })

  it('textlint-disable でルールを止められる', async () => {
    const code = [
      `// textlint-disable ${SPACING}`,
      `// ${SPACING_SENTENCE}`,
      '',
    ].join('\n')
    expect(await lint(code, 'test.ts')).toEqual([])
  })
})

describe('段落の切り方', () => {
  // 「時に」と「取りに」が行をまたぐ。行ごとに切ると助詞の重複を見逃す。
  const acrossLines = [
    '// キャッシュに無い URL はビルド時に',
    '// 取りに行く。',
    '',
  ]

  it('隣り合う行をつないで 1 つの段落にする', async () => {
    const findings = await lint(acrossLines.join('\n'), 'test.ts')
    expect(ruleIds(findings)).toContain(JOSHI)
  })

  it('空のコメント行で段落を切る', async () => {
    const code = [acrossLines[0], '//', acrossLines[1], ''].join('\n')
    const findings = await lint(code, 'test.ts')
    expect(ruleIds(findings)).not.toContain(JOSHI)
  })

  it('コード行を挟んだら段落を切る', async () => {
    const code = [acrossLines[0], 'const a = 1', acrossLines[1], ''].join('\n')
    const findings = await lint(code, 'test.ts')
    expect(ruleIds(findings)).not.toContain(JOSHI)
  })

  it('行末コメントは行ごとに独立した段落になる', async () => {
    const code = [
      `const a = 1 ${acrossLines[0]}`,
      `const b = 2 ${acrossLines[1]}`,
      '',
    ].join('\n')
    const findings = await lint(code, 'test.ts')
    expect(ruleIds(findings)).not.toContain(JOSHI)
  })
})

describe('# で始まるコメント', () => {
  it('YAML のコメントを検査する', async () => {
    const code = [`# ${SPACING_SENTENCE}`, 'on: push', ''].join('\n')
    const findings = await lint(code, 'test.yaml')
    expect(ruleIds(findings)).toEqual([SPACING])
    expect(findings.every(finding => finding.line === 1)).toBe(true)
  })

  it('shell の shebang より後ろを検査する', async () => {
    const code = ['#!/usr/bin/env bash', `# ${SPACING_SENTENCE}`, ''].join('\n')
    const findings = await lint(code, 'test.sh')
    expect(ruleIds(findings)).toEqual([SPACING])
    expect(findings.every(finding => finding.line === 2)).toBe(true)
  })
})

describe('原文との対応', () => {
  it('指摘の位置が原文の行と桁に一致する', async () => {
    const inMarkdown = await lint(SPACING_SENTENCE, 'test.md')
    const inComment = await lint(`// ${SPACING_SENTENCE}\n`, 'test.ts')
    // 「// 」の 3 文字ぶんだけ桁がずれる。
    expect(inComment).toEqual(
      inMarkdown.map(finding => ({
        ...finding,
        column: finding.column + 3,
      })),
    )
  })

  it('--fix がコメント以外を書き換えない', async () => {
    const code = [
      "const label = 'カテゴリー一覧'",
      `// ${SPACING_SENTENCE}`,
      '',
    ].join('\n')
    const fixed = await fix(code, 'test.ts')
    expect(fixed).toBe(code.replace('ではviteが', 'では vite が'))
  })
})
