import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { PluggableList } from 'unified'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
]

export const rehypePlugins: PluggableList = [
  rehypeHighlight,
  rehypeMdxCodeProps,
  rehypeMdxImportMedia,
]
