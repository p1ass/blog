import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { Heading } from '../../components/Heading'
import { getCategories } from '../../lib/posts'
import { blue } from '../../styles/color'

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`

export const title = 'Categories'

export default function CategoryTop() {
  const categories = getCategories()
  return (
    <Fragment>
      <Heading>Categories</Heading>
      <ul>
        {categories.map(category => (
          <li>
            <a href={`/categories/${category.id}/`} class={linkCss}>
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
