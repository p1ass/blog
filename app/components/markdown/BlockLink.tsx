import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { accent } from '../../styles/color'
import { space } from '../../styles/spacing'

const blockLinkWrapperCss = css`
  padding-bottom: ${space.md};
`

const blockLinkCss = css`
  color: ${accent};
`
export function BlockLink(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <div class={blockLinkWrapperCss}>
      <a href={props.href} class={blockLinkCss}>
        {props.children}
      </a>
    </div>
  )
}
