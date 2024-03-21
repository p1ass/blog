import { compile, run } from '@mdx-js/mdx'
import { Fragment, jsx } from 'hono/jsx/jsx-runtime'
import { useMDXComponents } from '../lib/mdx-components'
type Props = {
  content: string
  baseUrl: string
}

export async function MarkdownRenderer({ content, baseUrl }: Props) {
  const compiled = await compile(content, {
    jsxImportSource: 'hono/jsx',
    outputFormat: 'function-body',
    providerImportSource: './app/lib/mdx-components',
  })

  const transformed = String(compiled)

  const { default: MDXContent } = await run(transformed, {
    // @ts-ignore
    jsx: jsx,
    // @ts-ignore
    jsxDEV: jsx,
    // @ts-ignore
    jsxs: jsx,
    Fragment: Fragment,
    useMDXComponents: useMDXComponents,
  })
  return <MDXContent />
}
