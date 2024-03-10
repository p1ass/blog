import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { getCategories } from '../../lib/posts'
import { blue } from '../../styles/color'

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`

export default function CategoryTop() {
  const categories = getCategories()
  console.log(categories)
  return (
    <Fragment>
      <h1>Categories</h1>
      <ul>
        {categories.map(category => (
          <li>
            <a href={`/categories/${category.name}`} class={linkCss}>
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
