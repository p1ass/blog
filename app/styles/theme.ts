// どの段をどの役割に割り当てるか。app/styles/color.ts の var(--color-*) が
// ここを参照する。値そのものは app/styles/palette.ts にある。
//
// 3 段構成にしてある。:root が既定、prefers-color-scheme が OS 設定への追従、
// data-theme が読者の明示的な選択で、後ろほど強い。ダークの値はまだ入れていない。
// ダークモードはステップ 7 で入れる。

import { accent, neutral } from './palette'

// 役割から段への割り当て。テーマを足すときは、この形の表をもう 1 つ書く。
export type Assignment = {
  text: string
  textMuted: string
  textInverted: string
  accent: string
  accentSurface: string
  textOnAccentSurface: string
  border: string
  surface: string
  surfaceSubtle: string
  surfaceHover: string
  icon: string
}

export const light: Assignment = {
  text: neutral[900],
  textMuted: neutral[500],
  textInverted: neutral[0],

  accent: accent[500],
  accentSurface: accent[50],
  textOnAccentSurface: neutral[800],

  border: neutral[200],

  surface: neutral[0],
  surfaceSubtle: neutral[50],
  surfaceHover: neutral[100],

  icon: neutral[700],
}

// camelCase の役割名を --color-kebab-case に変換する。
// 役割を足したときに、CSS 変数の書き忘れが起きないようにするため。
function toCustomProperties(assignment: Assignment): string {
  return Object.entries(assignment)
    .map(([role, value]) => {
      const name = role.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
      return `    --color-${name}: ${value};`
    })
    .join('\n')
}

export const themeVariables = `
  :root {
${toCustomProperties(light)}
  }
`
