export const fontSize = {
  caption: '13px',
  bodySmall: '15px',
  body: '17px',
  h4: '20px',
  h3: '24px',
  h2: '28px',
  h1: '34px',
  code: '14px',
} as const

export const lineHeight = {
  body: 1.9,
  heading: 1.4,
  tight: 1.25,
} as const

export const fontWeight = {
  normal: 400,
  bold: 700,
} as const

export const fontFamily = {
  body: [
    'Hiragino Kaku Gothic ProN',
    'Hiragino Sans',
    'Yu Gothic UI',
    'Noto Sans JP',
    'Roboto',
    'Segoe UI',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Noto Color Emoji',
  ].join(', '),

  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'SF Mono',
    'Menlo',
    'Consolas',
    'Liberation Mono',
    'monospace',
  ].join(', '),
} as const

export const underline = {
  thickness: '1px',
  hoverThickness: '2px',
  offset: '0.2em',
} as const

export type FontSizeToken = keyof typeof fontSize
export type LineHeightToken = keyof typeof lineHeight
