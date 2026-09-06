import { css } from 'hono/css'
import { hatenaBlue, xBlack, xBlackHover, xSurfaceHover } from '../styles/brand'
import { icon, surfaceHover, textInverted } from '../styles/color'
import { transition } from '../styles/transition'
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
    ${transition('280ms', 'ease')}

    margin: 0 0 0 12px;

    &:hover{
        box-shadow: inset 0 0 0 22px ${surfaceHover};
    }
`

const shareButtonLinkCss = css`
  display: table-cell;
  width: ${verticalRhythmUnit * 1.625}rem ;
  height: ${verticalRhythmUnit * 1.625}rem;
  color: ${icon};
  text-align: center;
  vertical-align: middle;
  ${transition('280ms', 'ease')}
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
    background-color: ${xBlack};

    &:hover{
        box-shadow: inset 0 0 0 22px ${xBlackHover};
        background-color: ${xSurfaceHover};
    }
`

const xShareButtonLinkCss = css`
  ${shareButtonLinkCss}

  & i {
    color: ${textInverted};
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
    box-shadow: inset 0 0 0 0.1rem ${hatenaBlue};

    & i {
        color: ${hatenaBlue};
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
