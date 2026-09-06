// 色の原料。役割ではなく、色そのものに名前を付けたもの。
//
// ここを直接使わない。使うのは app/styles/color.ts の役割名で、どの段を
// どの役割に割り当てるかは app/styles/theme.ts が決める。役割名だけだと、
// テーマを 2 つ持ったときにダーク側の値を決める基準が無くなる。
//
// 段はすべて同じ色相で並べてある。既存の色を測ったところ、text (218°)、
// textMuted (215°)、border (214°)、icon (216°)、accent (215°) がすべて
// 214〜218° に収まっていた。もともと 1 色相の濃淡でできていたので、
// それを明示しただけで、新しい色は隙間を埋める分しか足していない。
//
// 数字は明度の目安で、小さいほど明るい。0 が白、950 が黒に近い。

// 地と文字に使う低彩度の段。色相 216°。
export const neutral = {
  // 既存の surface と textInverted
  0: '#ffffff',
  // 既存の surfaceSubtle。厳密には 240° だが、値を変えると見た目が動くので保つ
  50: '#f9f9fa',
  // 既存の surfaceHover。無彩色だが同じ理由で保つ
  100: '#eaeaea',
  // 既存の border
  200: '#dde0e4',
  300: '#c0c6ce',
  400: '#8d97a5',
  // 既存の textMuted
  500: '#636e7d',
  600: '#535a65',
  // 既存の icon
  700: '#42464c',
  // 既存の textOnAccentSurface
  800: '#303233',
  // 既存の text
  900: '#1e2126',
  950: '#0f1114',
} as const

// アクセント。色相 215°。OG 画像の下辺のボーダーにも使っている事実上の
// ブランド色なので、500 の値は動かさない。
export const accent = {
  // 既存の accentSurface
  50: '#e8f5fe',
  100: '#cfe2fc',
  200: '#adc7eb',
  300: '#8cacd9',
  400: '#6891ca',
  // 既存の accent
  500: '#4172b5',
  600: '#365e96',
  700: '#2b4b78',
  800: '#223959',
} as const

export type NeutralStep = keyof typeof neutral
export type AccentStep = keyof typeof accent
