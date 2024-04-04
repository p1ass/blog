import type { PropsWithChildren } from 'hono/jsx'
import { css } from 'hono/css'

const headingCss = css`
  line-height: 3.4rem;
`

export const Heading = ({ children }: PropsWithChildren) => {
  return <h1 class={headingCss}>{children}</h1>
}
