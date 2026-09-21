import type { Element, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { type Assignment, light } from '../styles/theme'

const roles = {
  background: 'surface',
  textColor: 'text',
  lineColor: 'textMuted',

  primaryColor: 'accentSurface',
  primaryBorderColor: 'accent',
  primaryTextColor: 'text',
  secondaryColor: 'surfaceSubtle',
  secondaryBorderColor: 'border',
  secondaryTextColor: 'text',
  tertiaryColor: 'surfaceSubtle',
  tertiaryBorderColor: 'border',
  tertiaryTextColor: 'text',

  edgeLabelBackground: 'surface',
  clusterBkg: 'surfaceSubtle',
  clusterBorder: 'border',

  actorBkg: 'accentSurface',
  actorBorder: 'accent',
  actorTextColor: 'text',
  actorLineColor: 'border',
  signalColor: 'textMuted',
  signalTextColor: 'text',
  labelBoxBkgColor: 'surfaceSubtle',
  labelBoxBorderColor: 'border',
  labelTextColor: 'text',
  loopTextColor: 'text',
  noteBkgColor: 'surfaceSubtle',
  noteBorderColor: 'border',
  noteTextColor: 'text',
} as const satisfies Record<string, keyof Assignment>

export const mermaidThemeVariables = Object.fromEntries(
  Object.entries(roles).map(([name, role]) => [name, light[role]]),
)

const customProperty = (role: keyof Assignment) =>
  `var(--color-${role.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)})`

const replacements = new Map<string, string>(
  Object.values(roles).map(role => [
    light[role].toLowerCase(),
    customProperty(role),
  ]),
)
const edgeLabelTranslucentBackground = 'rgba(255, 255, 255, 0.5)'
replacements.set(edgeLabelTranslucentBackground, customProperty('surface'))

if (
  new Set(Object.values(roles).map(role => light[role])).size !==
  new Set(Object.values(roles)).size
) {
  throw new Error(
    'Mermaid に渡す役割どうしで色が重なると、置き換え先の役割を決められない',
  )
}

const colorPattern = new RegExp(
  [...replacements.keys()].map(v => v.replace(/[()]/g, '\\$&')).join('|'),
  'gi',
)

function themed(value: string): string {
  return value.replace(
    colorPattern,
    match => replacements.get(match.toLowerCase()) ?? match,
  )
}

function isMermaid(node: Element): boolean {
  return (
    node.tagName === 'svg' && node.properties.ariaRoleDescription !== undefined
  )
}

export const rehypeMermaidTheme: Plugin<[], Root> = () => tree => {
  visit(tree, 'element', svg => {
    if (!isMermaid(svg)) return
    visit(svg, node => {
      if (node.type === 'text') {
        node.value = themed(node.value)
        return
      }
      if (node.type !== 'element') return
      for (const key of ['style', 'fill', 'stroke'] as const) {
        const value = node.properties[key]
        if (typeof value === 'string') node.properties[key] = themed(value)
      }
    })
    return 'skip'
  })
}
