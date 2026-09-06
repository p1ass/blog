// 角丸と境界線の太さ。
//
// 以前は角丸が verticalRhythmUnit の倍数で 3.4px / 4.25px / 8.5px と
// 半端な 3 種類あり、境界線は 0.5px / 1px / 0.2rem / 0.25rem が混在していた。
// 0.5px はサブピクセルなので、端数位置によって描かれたり消えたりする。
//
// 定義しただけで、まだどこにも当てていない。適用は形の PR で行う。

export const radius = {
  // インラインコード、タグ、小さいボタン
  sm: '4px',
  // カード、コードブロック、囲み
  md: '8px',
  // アバターやアイコンボタン
  full: '9999px',
} as const

export const borderWidth = {
  // 通常の境界線と区切り線。1 種類に揃える
  thin: '1px',
  // 引用の左線のように、意味を持たせて強調する箇所だけ
  thick: '3px',
} as const

export type RadiusToken = keyof typeof radius
export type BorderWidthToken = keyof typeof borderWidth
