// どの段をどの役割に割り当てるか。app/styles/color.ts の var(--color-*) がここを参照する。
// 値そのものは app/styles/palette.ts と app/styles/brand.ts にある。
//
// 2 段構成にしてある。:root が既定の明るいテーマ、prefers-color-scheme が OS 設定への追従で、後ろが強い。
// 読者が明示的に選ぶためのトグルは refactoring-plan.md のステップ 7 で入れる。data-theme の段はそのときに足す。
//
// 暗いテーマの側は、明るいテーマの割り当てを段の並びごと裏返して作ってある。
// たとえば text は neutral の 900 と 200、surface は 0 と 950 で、地と文字の関係が入れ替わるだけになる。
// ただし段の刻みは暗い側のほうが粗いので、面どうしの差は明るいテーマより広く出る。

import { brandWhite, githubBlack, xBlack } from './brand'
import { accent, neutral, tip, warning } from './palette'

// 役割から段への割り当て。テーマを足すときは、この形の表をもう 1 つ書く。
export type Assignment = {
  text: string
  textMuted: string
  textInverted: string
  accent: string
  accentMuted: string
  accentSurface: string
  textOnAccentSurface: string
  warning: string
  warningSurface: string
  textOnWarningSurface: string
  tip: string
  tipSurface: string
  textOnTipSurface: string
  border: string
  surface: string
  surfaceSubtle: string
  surfaceHover: string
  icon: string
  diagramSurface: string
  brandSurfaceBorder: string
  githubMark: string
  xMark: string
}

export const light: Assignment = {
  text: neutral[900],
  textMuted: neutral[500],
  textInverted: neutral[0],

  accent: accent[500],
  accentMuted: accent[400],
  accentSurface: accent[50],
  textOnAccentSurface: neutral[800],

  warning: warning[600],
  warningSurface: warning[50],
  textOnWarningSurface: neutral[800],

  tip: tip[600],
  tipSurface: tip[50],
  textOnTipSurface: neutral[800],

  border: neutral[200],

  surface: neutral[0],
  surfaceSubtle: neutral[50],
  surfaceHover: neutral[100],

  icon: neutral[700],

  // 図はビルド時に明るいテーマの色で描かれるので、暗いテーマでは白い面を敷いて図だけ明るいまま見せる。
  // 明るいテーマでは面を敷く必要がないので透明にする。
  diagramSurface: 'transparent',

  // ブランドカラーで塗った面が地に沈むときだけ引く境界。X ボタンの円は純黒なので、暗い地では輪郭が消える。
  brandSurfaceBorder: 'transparent',

  githubMark: githubBlack,
  xMark: xBlack,
}

export const dark: Assignment = {
  text: neutral[200],
  textMuted: neutral[400],
  textInverted: neutral[950],

  accent: accent[300],
  // 明るいテーマは accent より 1 段薄い色を下線に使う。これに合わせて、暗いテーマでは 2 段濃い色を使う。
  // 段の刻みが粗いので、1 段違い (accent の 400) だと本文リンクとの差が付かない。
  accentMuted: accent[500],
  accentSurface: accent[900],
  textOnAccentSurface: neutral[300],

  warning: warning[300],
  warningSurface: warning[900],
  textOnWarningSurface: neutral[300],

  tip: tip[300],
  tipSurface: tip[900],
  textOnTipSurface: neutral[300],

  border: neutral[700],

  surface: neutral[950],
  surfaceSubtle: neutral[900],
  surfaceHover: neutral[800],

  icon: neutral[300],

  diagramSurface: neutral[0],

  brandSurfaceBorder: neutral[500],

  githubMark: brandWhite,
  xMark: brandWhite,
}

// camelCase の役割名を --color-kebab-case に変換する。役割を足したときに、CSS 変数の書き忘れが起きないようにするため。
function toCustomProperties(assignment: Assignment): string {
  return Object.entries(assignment)
    .map(([role, value]) => {
      const name = role.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
      return `    --color-${name}: ${value};`
    })
    .join('\n')
}

// color-scheme は、スクロールバーやフォーム部品のようなこちらで色を指定していない部分を、地の明るさへ合わせるために置く。
export const themeVariables = `
  :root {
    color-scheme: light dark;
${toCustomProperties(light)}
  }

  @media (prefers-color-scheme: dark) {
    :root {
${toCustomProperties(dark)}
    }
  }
`
