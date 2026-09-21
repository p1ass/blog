import path from 'node:path'
import type { Root, RootContent } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { postPermalink } from './post-list'

function isMarker(node: RootContent): boolean {
  return node.type === 'mdxFlowExpression' && node.value.includes('<!--more-->')
}

function isContent(node: RootContent): boolean {
  return node.type !== 'yaml' && node.type !== 'mdxjsEsm'
}

export const remarkExcerpt: Plugin<[], Root> = () => (tree, file) => {
  const markerIndex = tree.children.findIndex(isMarker)
  if (markerIndex === -1 || !file.path) {
    return
  }

  const before = tree.children.slice(0, markerIndex)
  const excerpt = before.filter(isContent)
  if (excerpt.length === 0) {
    return
  }

  const wrapper: MdxJsxFlowElement = {
    type: 'mdxJsxFlowElement',
    name: 'div',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'data-post',
        value: postPermalink(path.basename(path.dirname(file.path))),
      },
      { type: 'mdxJsxAttribute', name: 'data-post-part', value: 'excerpt' },
    ],
    children: excerpt as MdxJsxFlowElement['children'],
  }

  tree.children = [
    ...before.filter(node => !isContent(node)),
    wrapper,
    ...tree.children.slice(markerIndex),
  ]
}
