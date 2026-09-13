export const duration = {
  fast: '150ms',
  base: '250ms',
} as const

export const easing = 'ease-out'

export const reducedMotion = '@media (prefers-reduced-motion: reduce)'

export type DurationToken = keyof typeof duration
