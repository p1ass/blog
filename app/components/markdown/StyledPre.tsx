import type { PropsWithChildren } from 'hono/jsx'

export function StyledPre(props: PropsWithChildren) {
  return <pre>{props.children}</pre>
}
