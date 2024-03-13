import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { getCategories, getTags } from '../../lib/posts'
import { blue } from '../../styles/color'

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`

export const title = 'Tags'

export default function TagTop() {
  const tags = getTags()
  return (
    <Fragment>
      <h1>Tags</h1>
      <ul>
        {tags.map(tag => (
          <li>
            <a href={`/tags/${tag.id}`} class={linkCss}>
              {tag.name}
            </a>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
