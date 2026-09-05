import { css } from 'hono/css'
import { verticalRhythmUnit } from '../styles/variables'

const shareIconsSectionCss = css`
    text-align: center;
    margin: ${verticalRhythmUnit}rem 0;
`

const shareIconWrapperCss = css`
    display: inline-block;
    text-align: left;
`

const shareButtonCss = css`
    float: left;
    border-radius: 100%;
    -moz-transition: all 280ms ease;
    -o-transition: all 280ms ease;
    -webkit-transition: all 280ms ease;
    transition: all 280ms ease;

    margin: 0 0 0 12px;

    &:hover{
        box-shadow: inset 0 0 0 22px #eaeaea;
    }
`

const shareButtonLinkCss = css`
  display: table-cell;
  width: ${verticalRhythmUnit * 1.625}rem ;
  height: ${verticalRhythmUnit * 1.625}rem;
  color: #42464c;
  text-align: center;
  vertical-align: middle;
  -moz-transition: all 280ms ease;
  -o-transition: all 280ms ease;
  -webkit-transition: all 280ms ease;
  transition: all 280ms ease;
  text-decoration: none;

  & i {
    font-size: 22px;
    vertical-align: middle;
    padding-bottom: 1px;
  
    &:hover {
      box-shadow: none;
    }
  }
`

const xCss = css`
    ${shareButtonCss}
    background-color: black;

    &:hover{
        box-shadow: inset 0 0 0 22px #444444;
        background-color: #dddddd;
    }
`

const xShareButtonLinkCss = css`
  ${shareButtonLinkCss}

  & i {
    color: #ffffff;
  }
`

const xIconCss = css`
  &:before {
    content: "𝕏";
    font-family: Verdana;
    font-weight: bold;
    font-style: normal;
    font-size: 1.5rem;
  }
`

const hatenaCss = css`
    ${shareButtonCss}
    box-shadow: inset 0 0 0 0.1rem #4ba3d9;

    & i {
        color: #4ba3d9;
    }
`

const hatenaIconCss = css`
    &:before {
        content: "B!";
        font-family: Verdana;
        font-weight: bold;
        font-style: normal;
  }
`

type Props = {
  title: string
  permalink: string
}

export function ShareButtons({ title, permalink }: Props) {
  // タイトルに # を含む記事があるため、必ずエンコードする
  const sharedUrl = encodeURIComponent(`https://blog.p1ass.com${permalink}`)
  const sharedText = encodeURIComponent(`${title} - ぷらすのブログ`)

  return (
    <section class={shareIconsSectionCss}>
      <div class={shareIconWrapperCss}>
        <div class={xCss}>
          <a
            href={`https://twitter.com/intent/tweet?url=${sharedUrl}&text=${sharedText}`}
            target='_blank'
            rel='noreferrer noopener'
            title='Post'
            class={xShareButtonLinkCss}
          >
            <i class={xIconCss} />
          </a>
        </div>
        <div class={hatenaCss}>
          <a
            href={`https://b.hatena.ne.jp/add?mode=confirm&url=${sharedUrl}&title=${sharedText}`}
            target='_blank'
            rel='noreferrer noopener'
            title='hatena'
            class={shareButtonLinkCss}
          >
            <i class={hatenaIconCss} />
          </a>
        </div>
      </div>
    </section>
  )
}
