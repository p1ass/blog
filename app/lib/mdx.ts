import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeMermaid from 'rehype-mermaid'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { PluggableList } from 'unified'
import { rehypeImageSize } from './rehype-image-size'
import {
  mermaidThemeVariables,
  rehypeMermaidTheme,
} from './rehype-mermaid-theme'
import { rehypeToc } from './rehype-toc'
import { remarkExcerpt } from './remark-excerpt'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm,
  remarkExcerpt,
]

export const rehypePlugins: PluggableList = [
  // 見出しの id は、本文が書き換わる前に振る
  rehypeToc,
  rehypeHighlight,
  rehypeMdxCodeProps,
  // 画像の寸法は、src が import 文へ書き換えられる前に読む
  rehypeImageSize,
  rehypeMdxImportMedia,
  [
    rehypeMermaid,
    { mermaidConfig: { theme: 'base', themeVariables: mermaidThemeVariables } },
  ],
  rehypeMermaidTheme,
]
