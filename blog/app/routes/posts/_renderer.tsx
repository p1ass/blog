import { format } from '@formkit/tempo'
import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Author } from '../../components/Author'
import { PostDetails } from '../../components/PostDetails'
import { PostPagination } from '../../components/PostPagination'
import { ShareButtons } from '../../components/ShareIcons'
import { getPaginationPosts } from '../../lib/posts'
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

const toTopLinkCss = css`
  text-align: center;

a{
  color: ${gray};
  text-decoration: none;

  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;

  &:hover {
    color: ${grayLight};
  }
}
`

export default jsxRenderer(({ children, Layout, frontmatter,filepath }) => {
  if (!(frontmatter && filepath)){
    return <div>Not Post Page</div>
  }

  const paginationPosts = getPaginationPosts(frontmatter.title)

  const permalink = `${import.meta.env.BASE_URL}${filepath.replaceAll('app/routes/','').replaceAll("index.mdx","")}`;

  return (
    <Layout title={frontmatter.title} frontmatter={frontmatter}>
      <div class={postDateCss}>
        <time datetime={frontmatter.date}>
          {format(parseDate(frontmatter.date), 'YYYY/MM/DD')}
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
