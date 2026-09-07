import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { bodyLinkCss } from '../../styles/link'
import { space } from '../../styles/spacing'

const blockLinkWrapperCss = css`
  padding-bottom: ${space.md};
`

export function BlockLink(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <div class={blockLinkWrapperCss}>
      <a href={props.href} class={bodyLinkCss}>
        {props.children}
      </a>
    </div>
  )
}
