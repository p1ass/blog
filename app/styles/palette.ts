// 役割ではなく、色そのものに名前を付けた定義。
//
// ここは直接使わない。
// 使うのは app/styles/color.ts の役割名で、どの段をどの役割に割り当てるかは app/styles/theme.ts が決める。
// 役割名だけだと、テーマを 2 つ持ったときにダーク側の値を決める基準がなくなる。
//
// 段はすべて同じ色相で並べてある。
// 既存の色を測ったところ text (218°) textMuted (215°) border (214°) icon (216°) accent (215°) がすべて 214〜218° に収まっていた。
// もともと 1 色相の濃淡でできていたので、新しい色は隙間を埋める分しか足していない。
//
// 数字は明度の目安で、小さいほど明るい。

// 地と文字に使う低彩度の段。色相 216°。
export const neutral = {
  0: '#ffffff', // 既存の surface と textInverted
  50: '#f9f9fa', // 既存の surfaceSubtle。厳密には 240° だが、値を変えると見た目が動くので保つ
  100: '#eaeaea', // 既存の surfaceHover。無彩色だが同じ理由で保つ
  200: '#dde0e4', // 既存の border
  300: '#c0c6ce',
  400: '#8d97a5',
  500: '#636e7d', // 既存の textMuted
  600: '#535a65',
  700: '#42464c', // 既存の icon
  800: '#303233', // 既存の textOnAccentSurface
  900: '#1e2126', // 既存の text
  950: '#0f1114',
} as const

// アクセント。色相 215°。
// 500 は OG 画像の下辺のボーダーにも使っている事実上のブランド色なので動かさない。
export const accent = {
  50: '#e8f5fe', // 既存の accentSurface
  100: '#cfe2fc',
  200: '#adc7eb',
  300: '#8cacd9',
  400: '#6891ca',
  500: '#4172b5', // 既存の accent
  600: '#365e96',
  700: '#2b4b78',
  800: '#223959',
} as const

export type NeutralStep = keyof typeof neutral
export type AccentStep = keyof typeof accent
