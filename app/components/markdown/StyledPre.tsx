import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import { verticalRhythmUnit } from '../../styles/variables'

export function StyledPre(props: PropsWithChildren) {
  return <pre class={atomOneDarkCss}>{props.children}</pre>
}

const atomOneDarkCss = css`

`
