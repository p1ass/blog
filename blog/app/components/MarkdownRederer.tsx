import { evaluate } from '@mdx-js/mdx'
import { Fragment, jsx } from 'hono/jsx/jsx-runtime'
import { rehypePlugins, remarkPlugins } from '../lib/mdx'
import { useMDXComponents } from '../lib/mdx-components'
type Props = {
  content: string
}

export async function MarkdownRenderer({ content }: Props) {
  const { default: MDXContent } = await evaluate(content, {
    jsx: jsx,
    jsxs: jsx,
    Fragment: Fragment,
    useMDXComponents: useMDXComponents,
    // コメントアウトを消すとエラーになる
    // remarkPlugins: remarkPlugins,
    // rehypePlugins: rehypePlugins,
  })
  return <MDXContent />
}
