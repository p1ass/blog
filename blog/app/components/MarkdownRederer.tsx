import { compile, evaluate } from '@mdx-js/mdx'
import { PropsWithChildren } from 'hono/jsx'
import { Fragment, jsx } from 'hono/jsx/jsx-runtime'
import { useMDXComponents } from '../lib/mdx-components'

type Props = {
  content: string
}

export async function MarkdownRederer({ content: text }: Props) {
  const { default: MDXContent } = await evaluate(text, {
    jsx: jsx,
    jsxs: jsx,
    Fragment: Fragment,
    useMDXComponents: useMDXComponents,
  })
  return (
    <Fragment>
      <MDXContent />
    </Fragment>
  )
}
