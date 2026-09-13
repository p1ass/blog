export const breakpoint = {
  sm: '640px',
  lg: '1080px',
} as const

export const contentWidth = '760px'

export function mediaUp(token: keyof typeof breakpoint): string {
  return `@media (min-width: ${breakpoint[token]})`
}

export type BreakpointToken = keyof typeof breakpoint
