// テーマごとの色の値。app/styles/color.ts の var(--color-*) がここを参照する。
//
// 3 段構成にしてある。:root が既定、prefers-color-scheme が OS 設定への追従、
// data-theme が読者の明示的な選択で、後ろほど強い。ダークの値はまだ入れていない。
// ダークモードはステップ 7 で入れる。

const lightColors = `
  --color-text: #1e2126;
  --color-text-muted: #636e7d;
  --color-text-inverted: #ffffff;

  --color-accent: #4172b5;
  --color-accent-surface: #e8f5fe;
  --color-text-on-accent-surface: #303233;

  --color-border: #dde0e4;

  --color-surface: #ffffff;
  --color-surface-subtle: #f9f9fa;
  --color-surface-hover: #eaeaea;

  --color-icon: #42464c;
`

export const themeVariables = `
  :root {
    ${lightColors}
  }
`
