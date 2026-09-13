import { css } from 'hono/css'
import { type Post, postPermalink } from '../lib/posts'
import { formatDate, parseDate } from '../lib/time'
import { accent, border, text, textInverted, textMuted } from '../styles/color'
import { canHover, duration } from '../styles/motion'
import { borderWidth, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { hoverTransition, transition } from '../styles/transition'
import { fontSize, lineHeight } from '../styles/typography'
import { PostDetails } from './PostDetails'

const sectionCss = css`
  margin-bottom: ${blockGap};
`

// width を動かすとフレームごとにレイアウトが走るので、幅は伸びきった長さで固定して transform で縮めておく。
const underlineCss = css`
  border-top: ${borderWidth.thick} solid ${accent};
  display: block;
  width: ${space['4xl']};
  transform: scaleX(calc(1 / 3));
  transform-origin: left;

  ${transition(['transform'])}
`

const timeCss = css`
  color: ${textMuted};
  letter-spacing: 1px;
`

const titleCss = css`
  display: block;
  color: ${text};
  font-size: ${fontSize.h2};
  margin: ${space['2xs']} 0;
  line-height: ${lineHeight.heading};

  ${transition(['color'], 'exit')}
`

const itemCss = css`
  border-top: ${borderWidth.thin} solid ${border};
  display: block;
  padding: ${blockGap} 0;
  text-decoration: none;

  ${canHover} {
    &:hover ${underlineCss} {
      transform: scaleX(1);
    }
    &:hover ${titleCss} {
      color: ${accent};
      transition-duration: ${duration.fast};
    }
  }
  &:focus-visible ${underlineCss} {
    transform: scaleX(1);
  }
  &:focus-visible ${titleCss} {
    color: ${accent};
    transition-duration: ${duration.fast};
  }

  &:last-child {
    border: 0;
  }
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

  ${hoverTransition(['background-color'], { pressable: true })}

  ${canHover} {
    &:hover {
      background-color: ${textMuted};
    }
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
