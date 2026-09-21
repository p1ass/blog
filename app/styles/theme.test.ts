import { describe, expect, it } from 'vitest'
import { type Assignment, dark, light } from './theme'

function relativeLuminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new Error(`16 進数の色ではない: ${hex}`)
  }
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map(i => {
    const c = Number.parseInt(value.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const BODY_TEXT = 4.5
const LARGE_TEXT_OR_UI = 3

type Requirement = {
  foreground: keyof Assignment
  background: keyof Assignment
  minimum: number
  note: string
}

const requirements: Requirement[] = [
  {
    foreground: 'text',
    background: 'surface',
    minimum: BODY_TEXT,
    note: '記事の地の文',
  },
  {
    foreground: 'textMuted',
    background: 'surface',
    minimum: BODY_TEXT,
    note: '日付やキャプション',
  },
  {
    foreground: 'accent',
    background: 'surface',
    minimum: BODY_TEXT,
    note: '本文中のリンク',
  },
  {
    foreground: 'accentMuted',
    background: 'surface',
    minimum: LARGE_TEXT_OR_UI,
    note: '本文中のリンクの下線',
  },
  {
    foreground: 'text',
    background: 'surfaceSubtle',
    minimum: BODY_TEXT,
    note: '表の縞の上の文字',
  },
  {
    foreground: 'textMuted',
    background: 'surfaceSubtle',
    minimum: BODY_TEXT,
    note: '表の縞の上の補助文',
  },
  {
    foreground: 'accent',
    background: 'surfaceSubtle',
    minimum: BODY_TEXT,
    note: 'hover したリンク',
  },
  {
    foreground: 'textOnAccentSurface',
    background: 'accentSurface',
    minimum: BODY_TEXT,
    note: 'Note の本文',
  },
  {
    foreground: 'textInverted',
    background: 'text',
    minimum: BODY_TEXT,
    note: '濃い地の上の文字',
  },
  {
    foreground: 'textOnWarningSurface',
    background: 'warningSurface',
    minimum: BODY_TEXT,
    note: 'Note (warning) の本文',
  },
  {
    foreground: 'textOnTipSurface',
    background: 'tipSurface',
    minimum: BODY_TEXT,
    note: 'Note (tip) の本文',
  },
  {
    foreground: 'accent',
    background: 'accentSurface',
    minimum: LARGE_TEXT_OR_UI,
    note: 'Note (info) のアイコン',
  },
  {
    foreground: 'warning',
    background: 'warningSurface',
    minimum: LARGE_TEXT_OR_UI,
    note: 'Note (warning) のアイコン',
  },
  {
    foreground: 'tip',
    background: 'tipSurface',
    minimum: LARGE_TEXT_OR_UI,
    note: 'Note (tip) のアイコン',
  },
  {
    foreground: 'icon',
    background: 'surface',
    minimum: LARGE_TEXT_OR_UI,
    note: 'シェアボタンのアイコン',
  },
]

const themes: [string, Assignment][] = [
  ['light', light],
  ['dark', dark],
]

describe.each(themes)('%s テーマのコントラスト', (_name, assignment) => {
  it.each(requirements)(
    '$note ($foreground on $background) が $minimum:1 以上',
    ({ foreground, background, minimum }) => {
      const ratio = contrastRatio(
        assignment[foreground],
        assignment[background],
      )
      expect(ratio).toBeGreaterThanOrEqual(minimum)
    },
  )
})

describe('暗いテーマだけの要件', () => {
  it('X ボタンの境界 (brandSurfaceBorder on surface) が 3:1 以上', () => {
    const ratio = contrastRatio(dark.brandSurfaceBorder, dark.surface)
    expect(ratio).toBeGreaterThanOrEqual(LARGE_TEXT_OR_UI)
  })
})
