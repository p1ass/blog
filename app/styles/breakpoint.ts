// 画面幅の分岐点。
//
// 以前は max-width: 600px が 5 箇所、max-width: 900px が 2 箇所、min-width: 600px が 1 箇所と、値も向きも混ざっていた。
// そのためタブレット幅では、要素ごとにレイアウトが変わるタイミングがずれていた。
//
// 2 段に絞り、向きは min-width に統一する。狭いほうを既定として書き、広くなったときだけ上書きする形になる。
//
// 定義しただけで、まだどこにも当てていない。レイアウトの PR で適用する。

export const breakpoint = {
  sm: '640px', // 本文が 1 カラムで収まる幅。ここを境に余白と文字を広げる
  lg: '1024px', // 本文 720px の左右に目次を置ける幅
} as const

// @media を直接書かず、これを通す。生の @media は lint で禁止する。
export function mediaUp(token: keyof typeof breakpoint): string {
  return `@media (min-width: ${breakpoint[token]})`
}

export type BreakpointToken = keyof typeof breakpoint
