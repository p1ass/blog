import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { gray, grayLight } from '../../styles/color'
import { Meta } from '../types'

const postTitleCss = css`
    font-size: 2.5rem;
    margin: 0 0 1.7rem;
    text-align: center;
    line-height: 3.4rem;
  `

const postDateCss = css`
  color: ${grayLight};
  letter-spacing: 1px;
  text-align: center;
  padding: 1.275rem 0 0.85rem;
`

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

function PostDetails({ frontmatter }: { frontmatter: Meta }) {
  return (
    <div class={postDetailsCss}>
      <span class={readingTimeCss}>xx min read |</span>
      {frontmatter.categories.map((category, _) => (
        <a href='/categories/{{ lower . }}/' class={tagCss}>
          #{category}
        </a>
      ))}
      {frontmatter.tags.map((tag, _) => (
        <a href='/tags/{{ lower . }}/' class={tagCss}>
          #{tag}
        </a>
      ))}
    </div>
  )
}

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  if (!frontmatter) {
    return <div>Not Post Page</div>
  }
  return (
    <Layout title={frontmatter.title}>
      <div class={postDateCss}>
        <time datetime={frontmatter.date.toString()}>{frontmatter?.date}</time>
      </div>
      <h1 class={postTitleCss}>{frontmatter.title}</h1>
      <PostDetails frontmatter={frontmatter} />
      <article>{children}</article>
    </Layout>
  )
})
