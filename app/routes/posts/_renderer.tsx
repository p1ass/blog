import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Author } from '../../components/Author'
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
import { mediaUp } from '../../styles/breakpoint'
import { text, textMuted } from '../../styles/color'
import { blockGap, space } from '../../styles/spacing'
import { tocOffset, tocWidth } from '../../styles/toc-layout'
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

// 本文と目次の置き場所。
//
// 本文の幅は動かさない。目次は本文の右の余白へ絶対配置で置き、本文の組みに関わらせない。
// 幅と、ページを左へ寄せる量は app/styles/toc-layout.ts にある。
//
// 目次を本文の左に置くこともできるが、横書きの本文へ視線を運ぶ途中に別の文字列が入る。右に置く。
//
// 目次は本文より前に書く。絶対配置なので見た目の位置は変わらず、キーボードと読み上げでは
// 記事を読み終える前に目次へ行き着く。目次は本文の前に見るものなので、並びもそれに合わせる。

// 記事の中身を、ヘッダーやフッターと同じだけ左へ寄せる。
// 寄せる先の理由は toc-layout.ts に、ヘッダーとフッター側の規則は routes/_renderer.tsx にある。
const postColumnCss = css`
  ${mediaUp('lg')} {
    margin-left: calc(-1 * ${tocOffset});
    margin-right: ${tocOffset};
  }
`

// 出すのは目次の 2 つのうち片方だけ。広い画面では右の aside、狭い画面では冒頭の details にする。
const postBodyCss = css`
  position: relative;

  & > aside {
    display: none;
  }

  ${mediaUp('lg')} {
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

    ${transition(['color'])}

    &:hover {
      color: ${textMuted};
    }
  }
`

export default jsxRenderer(
  ({ children, Layout, frontmatter, filepath, toc }) => {
    if (!(frontmatter && filepath)) {
      return <div>Not Post Page</div>
    }

    // 見出しの少ない記事では目次を出さない
    const showToc = toc !== undefined && hasToc(toc)

    const paginationPosts = getPaginationPosts(filepath)

    const permalink = postPermalink(filepathToSlug(filepath))

    return (
      <Layout title={frontmatter.title} frontmatter={frontmatter} toc={toc}>
        {/* 目次を出さない記事はずらさない。右に何も無いので、中央のままで釣り合う */}
        <div class={showToc ? postColumnCss : undefined}>
          <div class={postDateCss}>
            <time datetime={frontmatter.date}>
              {formatDate(parseDate(frontmatter.date), 'YYYY/MM/DD')}
            </time>
          </div>
          <h1 class={postTitleCss}>{frontmatter.title}</h1>
          <ShareButtons title={frontmatter.title} permalink={permalink} />
          <PostDetails frontmatter={frontmatter} />
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
