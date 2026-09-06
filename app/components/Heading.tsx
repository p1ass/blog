import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { lineHeight } from '../styles/typography'

const headingCss = css`
  line-height: ${lineHeight.heading};
`

export const Heading = ({ children }: PropsWithChildren) => {
  return <h1 class={headingCss}>{children}</h1>
}
