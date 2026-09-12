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
import { contentWidth, mediaUp } from '../../styles/breakpoint'
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
//
// 幅は本文と同じところで止める。目次を出すページでは列が本文より広くなるため、止めないと
// タイトルだけが 1 行に伸び、折り返しの釣り合いが崩れる。
const postTitleCss = css`
  font-size: ${fontSize.h1};
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

// 記事ページの中身の置き場所。
//
// 目次を出すページでは、中身の入る幅が本文だけより広くなる。本文と目次を合わせた幅をこの列に持たせ、
// 列ごとページの中央に置く。中央に寄せた文字 (日付、タイトル、シェアボタン) はこの列の中央に来るので、
// ヘッダーのサイト名やフッターと同じ、画面の中央の軸に乗る。
//
// 幅を広げるのは負の margin で、左右に同じだけ取る。main の 760px を左右へはみ出させたうえで、
// 中央は動かさない。
const postColumnCss = css`
  ${mediaUp('lg')} {
    margin-left: calc(-1 * ${tocOffset});
    margin-right: calc(-1 * ${tocOffset});
  }
`

// 本文の列。広い画面では列の左に寄せ、右の空きに目次を絶対配置で置く。
//
// 本文の幅は 760px のまま動かさない。列が広がっても、1 行の長さは読みやすさで決めた値に保つ。
// タグや筆者、前後の記事は列の幅いっぱいに置くので、左端は本文と揃う。
//
// 目次を本文の左に置くこともできるが、横書きの本文へ視線を運ぶ途中に別の文字列が入る。右に置く。
//
// 目次は本文より前に書く。絶対配置なので見た目の位置は変わらず、キーボードと読み上げでは
// 記事を読み終える前に目次へ行き着く。目次は本文の前に見るものなので、並びもそれに合わせる。
//
// 出すのは目次の 2 つのうち片方だけ。広い画面では右の aside、狭い画面では冒頭の details にする。
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
        {/* 目次を出さない記事は列を広げない。右に何も無いので、本文の幅のままで釣り合う */}
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
