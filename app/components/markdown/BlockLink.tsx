import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { accent } from '../../styles/color'

const blockLinkCss = css`
  color: ${accent};
`
export function BlockLink(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <div style='padding-bottom:16px'>
      <a href={props.href} class={blockLinkCss}>
        {props.children}
      </a>
    </div>
  )
}
