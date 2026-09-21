import { valueToEstree } from 'estree-util-value-to-estree'
import GithubSlugger from 'github-slugger'
import type { Element, Root, RootContent } from 'hast'
import type { Plugin } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import { summarySuffix } from './mdx-summary'
import type { TocItem } from './toc'

const headingDepth: Record<string, 2 | 3> = { h2: 2, h3: 3 }

function isFootnotes(node: Element): boolean {
  return node.tagName === 'section' && 'dataFootnotes' in node.properties
}

function headingText(node: Element): string {
  let text = ''
  visit(node, (child): typeof SKIP | undefined => {
    if (child.type === 'text') {
      text += child.value
    }
    if (child.type === 'element' && child.tagName === 'sup') {
      return SKIP
    }
    return undefined
  })
  return text.trim()
}

function tocExport(toc: TocItem[]): RootContent {
  return {
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            attributes: [],
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'toc' },
                  init: valueToEstree(toc),
                },
              ],
            },
          },
        ],
      },
    },
  } as unknown as RootContent
}

export const rehypeToc: Plugin<[], Root> = () => (tree, file) => {
  const toc: TocItem[] = []

  if (!file.path?.endsWith(summarySuffix)) {
    const slugger = new GithubSlugger()

    visit(tree, 'element', (node): typeof SKIP | undefined => {
      if (isFootnotes(node)) {
        return SKIP
      }
      const depth = headingDepth[node.tagName]
      if (depth === undefined) {
        return undefined
      }

      const text = headingText(node)
      const id =
        typeof node.properties.id === 'string'
          ? node.properties.id
          : slugger.slug(text)
      node.properties.id = id
      toc.push({ id, text, depth })
      return SKIP
    })
  }

  tree.children.unshift(tocExport(toc))
}
