// 余白。4px の倍数で、上にいくほど間隔を広げた段。
//
// 以前は verticalRhythmUnit (1.7rem = 27.2px) の倍数で書いていた。
// 27.2 は 4 の倍数ではないため、×0.125 のような小さい刻みを取ると 0.2125rem (3.4px) が生まれ、アイコンや境界線と揃わなくなる。
// 実際に Header.tsx にこの値が入っていた。
//
// 定義しただけで、まだどこにも当てていない。余白の PR で適用する。
export const space = {
  '2xs': '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const

// 本文の段落や見出しのあいだに置く縦の間隔。行送りと同じ値にすることで、本文が一定のリズムで流れる。
// 17px × 1.9 = 32.3px なので 4px グリッドの xl に寄せた。
export const blockGap = space.xl

export type SpaceToken = keyof typeof space
