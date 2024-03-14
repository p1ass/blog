import { PropsWithChildren } from 'hono/jsx'

export function BlockLink(props: PropsWithChildren<Hono.LinkHTMLAttributes>) {
  return (
    <div style='padding-bottom:16px'>
      <a href={props.href}>{props.children}</a>
    </div>
  )
}
