import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { PluggableList } from 'unified'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import remarkGfm from 'remark-gfm'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkGfm,
]

export const rehypePlugins: PluggableList = [
  rehypeHighlight,
  rehypeMdxCodeProps,
  rehypeMdxImportMedia,
]
