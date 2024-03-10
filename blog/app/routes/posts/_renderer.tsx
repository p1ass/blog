import { format } from '@formkit/tempo'
import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Author } from '../../components/Author'
import { PostDetails } from '../../components/PostDetails'
import { ShareButtons } from '../../components/ShareIcons'
import { parseDate } from '../../lib/time'
import { gray, grayLight } from '../../styles/color'

const postTitleCss = css`
  font-size: 2.5rem;
  margin: 0 0 1.7rem;
  text-align: center;
  line-height: 3.4rem;
  word-break: auto-phrase;
`

const postDateCss = css`
  color: ${grayLight};
  letter-spacing: 1px;
  text-align: center;
  padding: 1.275rem 0 0.85rem;
`

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  if (!frontmatter) {
    return <div>Not Post Page</div>
  }
  return (
    <Layout title={frontmatter.title}>
      <div class={postDateCss}>
        <time datetime={frontmatter.date}>
          {format(parseDate(frontmatter.date), 'YYYY/MM/DD')}
        </time>
      </div>
      <h1 class={postTitleCss}>{frontmatter.title}</h1>
      <ShareButtons title={frontmatter.title} permalink={'TODO'} />
      <PostDetails frontmatter={frontmatter} />
      <article>{children}</article>
      <ShareButtons title={frontmatter.title} permalink={'TODO'} />
      <Author />
    </Layout>
  )
})
