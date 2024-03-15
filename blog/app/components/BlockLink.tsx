import { css } from 'hono/css'
import { PropsWithChildren } from 'hono/jsx'
import { blue } from '../styles/color'

const blockLinkCss = css`
  color: ${blue};
`
export function BlockLink(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <div style='padding-bottom:16px' class={blockLinkCss}>
      <a href={props.href}>{props.children}</a>
    </div>
  )
}
