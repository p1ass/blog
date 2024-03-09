import { format, parse } from '@formkit/tempo'
import { css } from 'hono/css'
import { PostDetails } from '../routes/posts/_renderer'
import { Meta } from '../routes/types'
import { blue, gray, grayLight, white } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

type Props = {
  frontmatter: Meta
  summary: string
  permalink: string
}

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

export function PostSummarySection({ frontmatter, summary, permalink }: Props) {
  return (
    <section class={sectionCss}>
      <a href={permalink} class={itemCss}>
        <div>
          <time datetime={frontmatter.date} class={timeCss}>
            {format(
              parse(frontmatter.date, 'YYYY-MM-DDTHH:mm:ss', 'Asia/Tokyo'),
              'YYYY/MM/DD',
            )}
          </time>
          <h1 class={titleCss}>{frontmatter.title}</h1>
          <div class={underlineCss} />
        </div>
      </a>
      <PostDetails frontmatter={frontmatter} />
      <div class='catalogue-summary'>{summary}</div>

      <a class={moreButtonCss} href={permalink}>
        続きを読む
      </a>
    </section>
  )
}
