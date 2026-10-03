import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeMermaid from 'rehype-mermaid'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { PluggableList } from 'unified'
import { rehypeImageSize } from './rehype-image-size.ts'
import {
  mermaidThemeVariables,
  rehypeMermaidTheme,
} from './rehype-mermaid-theme.ts'
import { rehypeToc } from './rehype-toc.ts'
import { remarkExcerpt } from './remark-excerpt.ts'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm,
  remarkExcerpt,
]

export const rehypePlugins: PluggableList = [
  rehypeToc,
  rehypeHighlight,
  rehypeMdxCodeProps,
  rehypeImageSize,
  rehypeMdxImportMedia,
  [
    rehypeMermaid,
    { mermaidConfig: { theme: 'base', themeVariables: mermaidThemeVariables } },
  ],
  rehypeMermaidTheme,
]
