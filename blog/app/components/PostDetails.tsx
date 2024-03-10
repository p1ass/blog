import { css } from 'hono/css'
import { categoryNameToId } from '../lib/posts'
import { Meta } from '../routes/types'
import { gray, grayLight } from '../styles/color'

const postDetailsCss = css`
  padding-bottom: 1.7rem;
`

const readingTimeCss = css`
  color: ${grayLight};
`

const tagCss = css`
  color: ${grayLight};
  text-decoration: none;
  padding: 0 2px;

  &:hover {
    color: ${gray};
  }
  
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
`

export function PostDetails({ frontmatter }: { frontmatter: Meta }) {
  return (
    <div class={postDetailsCss}>
      <span class={readingTimeCss}>xx min read |</span>
      {frontmatter.categories?.map(categoryName => (
        <a
          href={`/categories/${categoryNameToId(categoryName)}`}
          class={tagCss}
        >
          #{categoryName}
        </a>
      ))}
      {frontmatter.tags?.map((tag, _) => (
        <a href='/tags/{{ lower . }}' class={tagCss}>
          #{tag}
        </a>
      ))}
    </div>
  )
}
