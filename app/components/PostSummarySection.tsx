import { css } from 'hono/css'
import { type Post, postPermalink } from '../lib/posts'
import { formatDate, parseDate } from '../lib/time'
import { accent, border, text, textInverted, textMuted } from '../styles/color'
import { borderWidth, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize, lineHeight } from '../styles/typography'
import { PostDetails } from './PostDetails'

const sectionCss = css`
  margin-bottom: ${blockGap};
`

const underlineCss = css`
  border-top: ${borderWidth.thick} solid ${accent};
  display: block;
  width: ${space.xl};

  ${transition('0.2s')}
`

const itemCss = css`
  border-top: ${borderWidth.thin} solid ${border};
  display: block;
  padding: ${blockGap} 0;
  text-decoration: none;

  &:hover ${underlineCss} {
    width: ${space['4xl']};
  }
  &:focus ${underlineCss} {
    width: ${space['4xl']};
  }

  &:last-child {
    border: 0;
  }
`

const timeCss = css`
  color: ${textMuted};
  letter-spacing: 1px;
`

// 一覧の記事タイトル。記事ページの h1 と同じ役割なので、大きさも揃える。
// 以前は一覧が 2rem、記事が 2.5rem で別値だった。
const titleCss = css`
  display: block;
  color: ${text};
  font-size: ${fontSize.h2};
  margin: ${space['2xs']} 0;
  line-height: ${lineHeight.heading};
`

const moreButtonCss = css`
  background-color: ${text};
  color: ${textInverted};
  width: 90px;
  border-radius: ${radius.sm};
  padding: ${space.sm} ${space.md};
  margin: 0 0 0 auto;
  display: flex;
  justify-content: center;
  text-decoration: none;
  
  ${transition('0.2s')}

  &:hover{
    background-color: ${textMuted};
  }
`

type Props = {
  post: Post
}

export function PostSummarySection({ post }: Props) {
  const ContentSummary = post.ContentSummary

  return (
    <section class={sectionCss}>
      <a href={postPermalink(post.slug)} class={itemCss}>
        <div>
          <time datetime={post.frontmatter.date} class={timeCss}>
            {formatDate(parseDate(post.frontmatter.date), 'YYYY/MM/DD')}
          </time>
          <h2 class={titleCss}>{post.frontmatter.title}</h2>
          <div class={underlineCss} />
        </div>
      </a>
      <PostDetails frontmatter={post.frontmatter} />
      <div class='catalogue-summary'>
        <ContentSummary />
      </div>

      <a class={moreButtonCss} href={postPermalink(post.slug)}>
        続きを読む
      </a>
    </section>
  )
}
