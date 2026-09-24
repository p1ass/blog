import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Author } from '../../components/Author'
import { DraftBadge } from '../../components/DraftBadge'
import { PostDetails } from '../../components/PostDetails'
import { PostPagination } from '../../components/PostPagination'
import { ShareButtons } from '../../components/ShareIcons'
import { TocDetails, TocNav } from '../../components/Toc'
import {
  filepathToSlug,
  getPaginationPosts,
  postPermalink,
} from '../../lib/posts'
import { formatDate, parseDate } from '../../lib/time'
import { hasToc } from '../../lib/toc'
import { contentWidth, mediaUp } from '../../styles/breakpoint'
import { text, textMuted } from '../../styles/color'
import { canHover } from '../../styles/motion'
import { blockGap, space } from '../../styles/spacing'
import { tocOffset, tocWidth } from '../../styles/toc-layout'
import { hoverTransition } from '../../styles/transition'
import { fontSize } from '../../styles/typography'

const postTitleCss = css`
  font-size: ${fontSize.h1};
  width: fit-content;
  max-width: ${contentWidth};
  margin: 0 auto ${blockGap};
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

const postColumnCss = css`
  ${mediaUp('lg')} {
    margin-left: calc(-1 * ${tocOffset});
    margin-right: calc(-1 * ${tocOffset});
  }
`

const postBodyCss = css`
  position: relative;

  & > aside {
    display: none;
  }

  ${mediaUp('lg')} {
    max-width: ${contentWidth};

    & > details {
      display: none;
    }

    & > aside {
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(100% + ${space.lg});
      width: ${tocWidth};
    }
  }
`

const toTopLinkCss = css`
  text-align: center;

  & a {
    color: ${text};
    text-decoration: none;

    ${hoverTransition(['color'])}

    ${canHover} {
      &:hover {
        color: ${textMuted};
      }
    }
  }
`

export default jsxRenderer(
  ({ children, Layout, frontmatter, filepath, toc }) => {
    if (!(frontmatter && filepath)) {
      return <div>Not Post Page</div>
    }

    const showToc = toc !== undefined && hasToc(toc)

    const paginationPosts = getPaginationPosts(filepath)

    const permalink = postPermalink(filepathToSlug(filepath))

    return (
      <Layout title={frontmatter.title} frontmatter={frontmatter} toc={toc}>
        <div class={showToc ? postColumnCss : undefined}>
          <div class={postDateCss}>
            <time datetime={frontmatter.date}>
              {formatDate(parseDate(frontmatter.date), 'YYYY/MM/DD')}
            </time>
            {frontmatter.draft ? <DraftBadge /> : null}
          </div>
          <h1 class={postTitleCss} data-post={permalink} data-post-part='title'>
            {frontmatter.title}
          </h1>
          <ShareButtons title={frontmatter.title} permalink={permalink} />
          <PostDetails frontmatter={frontmatter} permalink={permalink} />
          <div class={postBodyCss}>
            {showToc ? (
              <>
                <TocDetails toc={toc} />
                <aside>
                  <TocNav toc={toc} />
                </aside>
              </>
            ) : null}
            <article>{children}</article>
          </div>
          <ShareButtons title={frontmatter.title} permalink={permalink} />
          <Author />
          <PostPagination paginationPosts={paginationPosts} />
          <div class={toTopLinkCss}>
            <a href='/'>Topへ戻る</a>
          </div>
        </div>
      </Layout>
    )
  },
)
