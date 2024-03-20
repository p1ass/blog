import rehypeHighlight from 'rehype-highlight'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkMdxImages from 'remark-mdx-images'
import { PluggableList } from 'unified'

export const remarkPlugins: PluggableList = [
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkMdxImages,
]

export const rehypePlugins: PluggableList = [
  rehypeHighlight,
  rehypeMdxCodeProps,
]
