import type { Element, Root } from 'hast'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { light } from '../styles/theme'
import { rehypeMermaidTheme } from './rehype-mermaid-theme'

function svg(ariaRoleDescription?: string[]): Element {
  return {
    type: 'element',
    tagName: 'svg',
    properties: ariaRoleDescription ? { ariaRoleDescription } : {},
    children: [
      {
        type: 'element',
        tagName: 'style',
        properties: {},
        children: [
          {
            type: 'text',
            value: `.node rect{fill:${light.accentSurface};stroke:${light.accent.toUpperCase()};}.labelBkg{background-color:rgba(255, 255, 255, 0.5);}`,
          },
        ],
      },
      {
        type: 'element',
        tagName: 'rect',
        properties: { fill: light.surfaceSubtle, stroke: '#666' },
        children: [],
      },
    ],
  }
}

async function run(node: Element) {
  const tree: Root = { type: 'root', children: [node] }
  return (await unified().use(rehypeMermaidTheme).run(tree)) as Root
}

function styleOf(root: Root) {
  const style = (root.children[0] as Element).children[0] as Element
  return (style.children[0] as { value: string }).value
}

function rectOf(root: Root) {
  return (root.children[0] as Element).children[1] as Element
}

describe('rehypeMermaidTheme', () => {
  it('Mermaid の図の色を役割の CSS 変数に置き換える', async () => {
    const root = await run(svg(['flowchart-v2']))
    expect(styleOf(root)).toBe(
      '.node rect{fill:var(--color-accent-surface);stroke:var(--color-accent);}.labelBkg{background-color:var(--color-surface);}',
    )
    expect(rectOf(root).properties).toEqual({
      fill: 'var(--color-surface-subtle)',
      stroke: '#666',
    })
  })

  it('Mermaid 以外の svg は触らない', async () => {
    const root = await run(svg())
    expect(styleOf(root)).toContain(light.accentSurface)
  })
})
