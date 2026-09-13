import { contentWidth } from './breakpoint'
import { space } from './spacing'

// 目次が右端に来るので、body の左右の余白より広く取る。
const minGutter = space['2xl']

// 100vw は縦スクロールバーを含むが、余白を 48px 取っているのではみ出さない。
export const tocWidth = `min(280px, calc(100vw - ${contentWidth} - ${space.lg} - ${minGutter} * 2))`

// 本文と目次をひとまとまりとして中央に置くため、ヘッダーやフッターも含めて同じ量だけ左へ寄せる。
export const tocOffset = `calc((${tocWidth} + ${space.lg}) / 2)`
