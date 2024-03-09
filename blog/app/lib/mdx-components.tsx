import { css } from 'hono/css'
import { PropsWithChildren } from 'hono/jsx'
import { MDXComponents } from 'mdx/types'

export function useMDXComponents(): MDXComponents {
  const components = {
    img: Image,
  }
  return components
}

const imageCss = css`
  display: block;
  max-height: 500px;
  max-width: 100%;
  margin: 0 auto;
`

export function Image(props: PropsWithChildren<Hono.ImgHTMLAttributes>) {
  return (
    <a href={props.src}>
      <img src={props.src} alt={props.alt} class={imageCss} />
    </a>
  )
}
