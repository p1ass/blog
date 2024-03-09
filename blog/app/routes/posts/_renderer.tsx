import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { grayLight } from '../../styles/color'

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

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  return (
    <Layout title={frontmatter?.title}>
      <div class={postDateCss}>
        <time datetime={frontmatter?.date.toString()}>{frontmatter?.date}</time>
      </div>
      <h1 class={postTitleCss}>{frontmatter?.title}</h1>
      <div>
        {frontmatter?.tags.map((tag, index) => (
          <span key={index}>#{tag}</span>
        ))}
      </div>
      <article>{children}</article>
    </Layout>
  )
})
