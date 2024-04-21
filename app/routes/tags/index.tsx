import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { getTags } from '../../lib/posts'
import { blue } from '../../styles/color'
import { Heading } from '../../components/Heading'

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`

export const title = 'Tags'

export default function TagTop() {
  const tags = getTags()
  return (
    <Fragment>
      <Heading>Tags</Heading>
      <ul>
        {tags.map(tag => (
          <li>
            <a href={`/tags/${tag.id}/`} class={linkCss}>
              {tag.name}
            </a>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
