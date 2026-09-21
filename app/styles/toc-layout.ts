import { contentWidth } from './breakpoint'
import { space } from './spacing'

const minGutter = space['2xl']

export const tocWidth = `min(280px, calc(100vw - ${contentWidth} - ${space.lg} - ${minGutter} * 2))`

export const tocOffset = `calc((${tocWidth} + ${space.lg}) / 2)`
