// 直接は使わず、color.ts の役割名を通す。数字は小さいほど明るい。

export const neutral = {
  0: '#ffffff',
  50: '#f9f9fa',
  100: '#eaeaea',
  200: '#dde0e4',
  300: '#c0c6ce',
  400: '#8d97a5',
  500: '#636e7d',
  600: '#535a65',
  700: '#42464c',
  800: '#303233',
  900: '#1e2126',
  950: '#0f1114',
} as const

// 500 は OG 画像の帯にも使うブランドカラーなので変えない。
// 300 は暗い地で青がくすんで見えるので、この段だけ彩度を 80% に上げてある。
export const accent = {
  50: '#e8f5fe',
  100: '#cfe2fc',
  200: '#adc7eb',
  300: '#7eaef1',
  400: '#6891ca',
  500: '#4172b5',
  600: '#365e96',
  700: '#2b4b78',
  800: '#223959',
  900: '#16263b',
} as const

// accent と同じ色相では注意が伝わらないので、別の色相にする。
export const warning = {
  50: '#fff4e5',
  300: '#f0a742',
  600: '#a35b00',
  900: '#342614',
} as const

export const tip = {
  50: '#e8f6ec',
  300: '#66cc90',
  600: '#1f7a3d',
  900: '#142e1f',
} as const

export type NeutralStep = keyof typeof neutral
export type AccentStep = keyof typeof accent
export type WarningStep = keyof typeof warning
export type TipStep = keyof typeof tip
