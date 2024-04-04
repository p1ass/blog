import { format } from '@formkit/tempo'
import { css } from 'hono/css'

import type { Post } from '../lib/posts'
import { parseDate } from '../lib/time'
import { blue, gray, grayLight, white } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostDetails } from './PostDetails'

const sectionCss = css`
  margin-bottom: ${verticalRhythmUnit}rem;
`

const underlineCss = css`
  border-top: 0.2rem solid ${blue};
  display: block;
  width: 2rem;

  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
`

const itemCss = css`
  border-top: 1px solid $border;
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
  color: ${grayLight};
  letter-spacing: 1px;
`

const titleCss = css`
  display: block;
  color: ${gray};
  font-size: 2rem;
  margin: ${verticalRhythmUnit * 0.25}rem 0;
  line-height: 3.4rem;
  
  @media (max-width: 900px) {
    font-size: 1.75rem;
    line-height: ${verticalRhythmUnit * 1.75}rem;
  }
`

const moreButtonCss = css`
  background-color: ${gray};
  color: ${white};
  width: 90px;
  border-radius: ${verticalRhythmUnit * 0.25}rem;
  padding: ${verticalRhythmUnit * 0.5}rem 1rem;
  margin: 0 0 0 auto;
  display: flex;
  justify-content: center;
  text-decoration: none;
  
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;

  &:hover{
    background-color: ${grayLight};
  }
`

type Props = {
  post: Post
}

export async function PostSummarySection({ post }: Props) {
  // console.log(permalink)
  const postUrl = `../routes${post.permalink}index.mdx?raw`
  const { default: postText } = await import(postUrl)

  // この辺ヌルポになりそう
  let summaryText = postText.split('{/* <!--more--> */}')[0] as string
  summaryText = summaryText.split('---')[2]

  return (
    <section class={sectionCss}>
      <a href={post.permalink} class={itemCss}>
        <div>
          <time datetime={post.frontmatter.date} class={timeCss}>
            {format(parseDate(post.frontmatter.date), 'YYYY/MM/DD')}
          </time>
          <h1 class={titleCss}>{post.frontmatter.title}</h1>
          <div class={underlineCss} />
        </div>
      </a>
      <PostDetails frontmatter={post.frontmatter} />
      <div class='catalogue-summary'>
        <MarkdownRenderer
          content={summaryText}
          baseUrl={post.fullFilePath.href}
        />
      </div>

      <a class={moreButtonCss} href={post.permalink}>
        続きを読む
      </a>
    </section>
  )
}
