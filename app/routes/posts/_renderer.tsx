import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Author } from '../../components/Author'
import { PostDetails } from '../../components/PostDetails'
import { PostPagination } from '../../components/PostPagination'
import { ShareButtons } from '../../components/ShareIcons'
import {
  filepathToSlug,
  getPaginationPosts,
  postPermalink,
} from '../../lib/posts'
import { formatDate, parseDate } from '../../lib/time'
import { text, textMuted } from '../../styles/color'
import { transition } from '../../styles/transition'

const postTitleCss = css`
  font-size: 2.5rem;
  margin: 0 0 1.7rem;
  text-align: center;
  line-height: 3.4rem;
  word-break: auto-phrase;
  
  @media (max-width: 900px) {
    font-size: 1.75rem;
    line-height: 2.55rem;
}
`

const postDateCss = css`
  color: ${textMuted};
  letter-spacing: 1px;
  text-align: center;
  padding: 1.275rem 0 0.85rem;
`

const toTopLinkCss = css`
  text-align: center;

  & a{
    color: ${text};
    text-decoration: none;
  
    ${transition('0.2s')}
  
    &:hover {
      color: ${textMuted};
    }
  }
`

export default jsxRenderer(({ children, Layout, frontmatter, filepath }) => {
  if (!(frontmatter && filepath)) {
    return <div>Not Post Page</div>
  }

  const paginationPosts = getPaginationPosts(filepath)

  const permalink = postPermalink(filepathToSlug(filepath))

  return (
    <Layout title={frontmatter.title} frontmatter={frontmatter}>
      <div class={postDateCss}>
        <time datetime={frontmatter.date}>
          {formatDate(parseDate(frontmatter.date), 'YYYY/MM/DD')}
        </time>
      </div>
      <h1 class={postTitleCss}>{frontmatter.title}</h1>
      <ShareButtons title={frontmatter.title} permalink={permalink} />
      <PostDetails frontmatter={frontmatter} />
      <article>{children}</article>
      <ShareButtons title={frontmatter.title} permalink={permalink} />
      <Author />
      <PostPagination paginationPosts={paginationPosts} />
      <div class={toTopLinkCss}>
        <a href='/'>Topへ戻る</a>
      </div>
    </Layout>
  )
})
