import { brandWhite, githubBlack, xBlack } from './brand.ts'
import { accent, neutral, tip, warning } from './palette.ts'

export type Assignment = {
  text: string
  textMuted: string
  textInverted: string
  accent: string
  accentMuted: string
  accentSurface: string
  textOnAccentSurface: string
  warning: string
  warningSurface: string
  textOnWarningSurface: string
  tip: string
  tipSurface: string
  textOnTipSurface: string
  border: string
  surface: string
  surfaceSubtle: string
  surfaceHover: string
  icon: string
  diagramSurface: string
  brandSurfaceBorder: string
  githubMark: string
  xMark: string
}

export const light: Assignment = {
  text: neutral[900],
  textMuted: neutral[500],
  textInverted: neutral[0],

  accent: accent[500],
  accentMuted: accent[400],
  accentSurface: accent[50],
  textOnAccentSurface: neutral[800],

  warning: warning[600],
  warningSurface: warning[50],
  textOnWarningSurface: neutral[800],

  tip: tip[600],
  tipSurface: tip[50],
  textOnTipSurface: neutral[800],

  border: neutral[200],

  surface: neutral[0],
  surfaceSubtle: neutral[50],
  surfaceHover: neutral[100],

  icon: neutral[700],

  diagramSurface: 'transparent',

  brandSurfaceBorder: 'transparent',

  githubMark: githubBlack,
  xMark: xBlack,
}

export const dark: Assignment = {
  text: neutral[200],
  textMuted: neutral[400],
  textInverted: neutral[950],

  accent: accent[300],
  accentMuted: accent[500],
  accentSurface: accent[900],
  textOnAccentSurface: neutral[300],

  warning: warning[300],
  warningSurface: warning[900],
  textOnWarningSurface: neutral[300],

  tip: tip[300],
  tipSurface: tip[900],
  textOnTipSurface: neutral[300],

  border: neutral[700],

  surface: neutral[950],
  surfaceSubtle: neutral[900],
  surfaceHover: neutral[800],

  icon: neutral[300],

  diagramSurface: neutral[0],

  brandSurfaceBorder: neutral[500],

  githubMark: brandWhite,
  xMark: brandWhite,
}

function toCustomProperties(assignment: Assignment): string {
  return Object.entries(assignment)
    .map(([role, value]) => {
      const name = role.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
      return `    --color-${name}: ${value};`
    })
    .join('\n')
}

export const themeVariables = `
  :root {
    color-scheme: light dark;
${toCustomProperties(light)}
  }

  @media (prefers-color-scheme: dark) {
    :root {
${toCustomProperties(dark)}
    }
  }

  :root[data-theme=light] {
    color-scheme: light;
${toCustomProperties(light)}
  }

  :root[data-theme=dark] {
    color-scheme: dark;
${toCustomProperties(dark)}
  }
`
