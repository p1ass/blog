export const radius = {
  sm: '4px',
  md: '8px',
  full: '9999px',
} as const

export const borderWidth = {
  thin: '1px',
  thick: '3px',
} as const

export const focusRing = {
  width: '2px',
  offset: '2px',
} as const

export type RadiusToken = keyof typeof radius
export type BorderWidthToken = keyof typeof borderWidth
