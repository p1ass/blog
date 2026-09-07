import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeMermaid from 'rehype-mermaid'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { PluggableList } from 'unified'
import { rehypeImageSize } from './rehype-image-size'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm,
]

export const rehypePlugins: PluggableList = [
  rehypeHighlight,
  rehypeMdxCodeProps,
  // 画像の寸法は、src が import 文へ書き換えられる前に読む
  rehypeImageSize,
  rehypeMdxImportMedia,
  rehypeMermaid,
]
