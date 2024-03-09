import { PropsWithChildren } from 'hono/jsx'
import { MDXComponents } from 'mdx/types'

export function useMDXComponents(): MDXComponents {
  const MyH1 = (props: PropsWithChildren) => (
    <h1 style={{ color: 'tomato' }} {...props} />
  )
  const components = {
    h2: MyH1,
  }
  return components
}
