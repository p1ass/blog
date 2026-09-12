import { valueToEstree } from 'estree-util-value-to-estree'
import GithubSlugger from 'github-slugger'
import type { Element, Root, RootContent } from 'hast'
import type { Plugin } from 'unified'
import { SKIP, visit } from 'unist-util-visit'
import { summarySuffix } from './mdx-summary'
import type { TocItem } from './toc'

// 記事本文の見出しに id を振り、その並びを TOC として export する。
//
// 目次の実装先を 1 つにするため、抽出はビルド時のここだけで行う。記事の hast から h2 と h3 を拾い、
// その並びを toc という名前で MDX モジュールに足す。
// HonoX はルートのモジュールの export をそのままレンダラーの props に渡すので、
// app/routes/posts/_renderer.tsx が toc を受け取れる。
//
// id は github-slugger で作る。GitHub の Markdown と同じ規則なので、日本語の見出しは
// そのまま残り、記事から見出しへのリンクを手で書いたときにも一致する。
//
// 一覧の抜粋 (.summary.mdx) では何もしない。抜粋は 1 ページに 10 件並ぶので、
// 同じ見出しを持つ記事が同じページに載ると id が重複する。抜粋に目次は出さないため、
// 振る理由もない。

const headingDepth: Record<string, 2 | 3> = { h2: 2, h3: 3 }

// 脚注のまとまり。remark-gfm が記事の末尾に置く。中の h2 は読み上げ専用の Footnotes なので目次には入れない。
function isFootnotes(node: Element): boolean {
  return node.tagName === 'section' && 'dataFootnotes' in node.properties
}

// 見出しの文字。インラインコードやリンクを含む見出しがあるので、中の文字を集める。
// 脚注の参照 (sup) だけは外す。目次に「1」だけが混ざる。
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
