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
import { blockGap, space } from '../../styles/spacing'
import { transition } from '../../styles/transition'
import { fontSize } from '../../styles/typography'

// 記事タイトル。ページに 1 つだけ置く見出しなので h1 の段を使う。
//
// 以前はモバイルで 1.75rem になり、本文の h2 と同じ値だった。
// スマホで記事を開くとタイトルと小見出しが見分けられない状態だったので、
// 画面幅による分岐をやめて 1 つの大きさに揃えた。
const postTitleCss = css`
  font-size: ${fontSize.h1};
  margin: 0 0 ${blockGap};
  text-align: center;
  word-break: auto-phrase;
`

const postDateCss = css`
  color: ${textMuted};
  font-size: ${fontSize.caption};
  letter-spacing: 1px;
  text-align: center;
  padding: ${space.lg} 0 ${space.sm};
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
