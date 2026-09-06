import { css } from 'hono/css'
import { type Post, postPermalink } from '../lib/posts'
import { formatDate, parseDate } from '../lib/time'
import { accent, border, text, textInverted, textMuted } from '../styles/color'
import { transition } from '../styles/transition'
import { verticalRhythmUnit } from '../styles/variables'
import { PostDetails } from './PostDetails'

const sectionCss = css`
  margin-bottom: ${verticalRhythmUnit}rem;
`

const underlineCss = css`
  border-top: 0.2rem solid ${accent};
  display: block;
  width: 2rem;

  ${transition('0.2s')}
`

const itemCss = css`
  border-top: 1px solid ${border};
  display: block;
  padding: ${verticalRhythmUnit}rem 0;
  text-decoration: none;

  &:hover ${underlineCss} {
    width: 5rem;
  }
  &:focus ${underlineCss} {
    width: 5rem;
  }

  &:last-child {
    border: 0;
  }
`

const timeCss = css`
  color: ${textMuted};
  letter-spacing: 1px;
`

const titleCss = css`
  display: block;
  color: ${text};
  font-size: 2rem;
  margin: ${verticalRhythmUnit * 0.25}rem 0;
  line-height: 3.4rem;
  
  @media (max-width: 900px) {
    font-size: 1.75rem;
    line-height: ${verticalRhythmUnit * 1.75}rem;
  }
`

const moreButtonCss = css`
  background-color: ${text};
  color: ${textInverted};
  width: 90px;
  border-radius: ${verticalRhythmUnit * 0.25}rem;
  padding: ${verticalRhythmUnit * 0.5}rem 1rem;
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
