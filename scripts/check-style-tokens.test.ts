import { describe, expect, it } from 'vitest'
import { findViolations } from './check-style-tokens'

function rules(source: string, file = 'app/components/Sample.tsx') {
  return findViolations(file, source).map(
    violation => `${violation.rule}:${violation.value}`,
  )
}

describe('検出する', () => {
  it('css`` の中の 16 進数の色', () => {
    expect(rules('const a = css`color: #4172b5;`')).toEqual(['hex:#4172b5'])
  })

  it('トークンを持つプロパティの px', () => {
    expect(rules('const a = css`padding: 12px;`')).toEqual(['padding:12px'])
  })

  it('rem と em も px と同じに扱う', () => {
    expect(rules('const a = css`font-size: 0.85rem;`')).toEqual([
      'font-size:0.85rem',
    ])
  })

  it('ショートハンドの中の太さ', () => {
    expect(rules('const a = css`border: 1px solid red;`')).toEqual([
      'border:1px',
    ])
  })

  it('生の @media', () => {
    expect(
      rules('const a = css`@media (min-width: 640px) { color: red; }`'),
    ).toEqual(['@media:@media'])
  })

  it('box-shadow', () => {
    expect(rules('const a = css`box-shadow: 0 1px 2px red;`')).toEqual([
      'box-shadow:box-shadow',
    ])
  })

  it('JSX の style 属性', () => {
    expect(rules('const a = <div style={`padding: 3px`} />')).toEqual([
      'padding:3px',
    ])
  })

  it('keyframes の中', () => {
    expect(rules('const a = keyframes`from { margin: 5px; }`')).toEqual([
      'margin:5px',
    ])
  })
})

describe('検出しない', () => {
  it('トークンを差し込んだ値', () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: チェックする側の入力なので、差し込みの形のまま渡す
    expect(rules('const a = css`padding: ${space.md};`')).toEqual([])
  })

  it('日本語のコメントに出てくる px や色', () => {
    const source = [
      '// 本文 17px を基準にする。accent は #4172b5。',
      // biome-ignore lint/suspicious/noTemplateCurlyInString: 同上
      'const a = css`padding: ${space.md};`',
    ].join('\n')
    expect(rules(source)).toEqual([])
  })

  it('CSS ではない文字列の中の値', () => {
    expect(rules('const a = \'<meta content="#4172b5">\'')).toEqual([])
  })

  it('差し込んだ式の引数。transition(["box-shadow"]) が引っかからない', () => {
    expect(
      rules(`const a = css\`color: red; \${transition(['box-shadow'])}\``),
    ).toEqual([])
  })

  it('コンポーネントひとつの都合で決まる寸法', () => {
    expect(rules('const a = css`width: 80px; height: 47px;`')).toEqual([])
  })

  it('単位のない 0', () => {
    expect(rules('const a = css`padding: 0; border: 0;`')).toEqual([])
  })

  it('割合で書いた値', () => {
    expect(
      rules('const a = css`max-width: 100%; border-radius: 50%;`'),
    ).toEqual([])
  })

  it('入れ子のセレクタ。&:hover をプロパティと読み違えない', () => {
    expect(rules('const a = css`&:hover { color: red; }`')).toEqual([])
  })
})

describe('報告の中身', () => {
  it('行番号と、その行の中身を返す', () => {
    const source = ['const a = css`', '  padding: 12px;', '`'].join('\n')
    const [violation] = findViolations('app/components/Sample.tsx', source)
    expect(violation.line).toBe(2)
    expect(violation.code).toBe('padding: 12px;')
    expect(violation.hint).toContain('spacing.ts')
  })
})
