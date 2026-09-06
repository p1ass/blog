// 動きの長さと曲線。
//
// 以前は 0.2s / 0.3s / 280ms が 11 箇所で場当たりに使われていた。
// また transition: all を書いていたため、意図しないプロパティまで
// アニメーションしていた。
//
// 定義しただけで、まだどこにも当てていない。適用は状態表現の PR で行う。
// そのとき、prefers-reduced-motion: reduce で全停止する規則も入れる。

export const duration = {
  // hover や focus の色の変化
  fast: '150ms',
  // 面の入れ替わりや、少し距離のある動き
  base: '250ms',
} as const

// 1 つに統一する。始まりが速く終わりが緩む曲線で、UI の応答として自然に見える。
export const easing = 'ease-out'

export type DurationToken = keyof typeof duration
