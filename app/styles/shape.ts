// 角丸と境界線の太さ。
//
// 以前は角丸が verticalRhythmUnit の倍数で 3.4px / 4.25px / 8.5px と、そろっていない 3 種類あり、境界線は 0.5px / 1px / 0.2rem / 0.25rem が混在していた。
// 0.5px はサブピクセルなので、端数位置によって描かれたり消えたりする。
//
// 定義しただけで、まだどこにも当てていない。形の PR で適用する。

export const radius = {
  sm: '4px', // インラインコード、タグ、小さいボタン
  md: '8px', // カード、コードブロック、囲み
  full: '9999px', // アバターやアイコンボタン
} as const

export const borderWidth = {
  thin: '1px', // 通常の境界線と区切り線
  thick: '3px', // 引用の左線のように、意味を持たせて強調する箇所だけ
} as const

export type RadiusToken = keyof typeof radius
export type BorderWidthToken = keyof typeof borderWidth
