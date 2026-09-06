// 動きの長さと曲線。
//
// 以前は 0.2s / 0.3s / 280ms が 11 箇所でその場ごとに使われていた。
// また transition: all を書いていたため、意図しないプロパティまでアニメーションしていた。
//
// 定義しただけで、まだどこにも当てていない。状態表現の PR で適用し、そのとき prefers-reduced-motion: reduce で全停止する規則も入れる。

export const duration = {
  fast: '150ms', // hover や focus の色の変化
  base: '250ms', // 面の入れ替わりや、少し距離のある動き
} as const

// 1 つに統一する。始まりが速く終わりが緩む曲線で、UI の応答として自然に見える。
export const easing = 'ease-out'

export type DurationToken = keyof typeof duration
