import { compile, run } from '@mdx-js/mdx'
import { Fragment, jsx } from 'hono/jsx/jsx-runtime'
import { useMDXComponents } from '../lib/mdx-components'
type Props = {
  content: string
  baseUrl: string
}

export async function MarkdownRenderer({ content, baseUrl }: Props) {
  const compiled = await compile(content, {
    baseUrl: baseUrl,
    jsxImportSource: 'hono/jsx',
    outputFormat: 'function-body',
    providerImportSource: './app/lib/mdx-components',
  })

  const transformed = String(compiled)

  console.log(transformed)
  const { default: MDXContent } = await run(transformed, {
    baseUrl: import.meta.url,
    jsx: jsx,
    jsxDEV: jsx,
    jsxs: jsx,
    Fragment: Fragment,
    useMDXComponents: useMDXComponents,

    // コメントアウトを消すとエラーになる
    // remarkPlugins: remarkPlugins,
    // rehypePlugins: rehypePlugins,
  })
  return <MDXContent />
}
