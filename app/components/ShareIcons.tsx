import { css } from 'hono/css'
import { brandWhite, hatenaBlue, xBlack, xBlackHover } from '../styles/brand'
import { brandSurfaceBorder, icon, surfaceHover } from '../styles/color'
import { canHover } from '../styles/motion'
import { borderWidth, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { hoverTransition, transition } from '../styles/transition'
import { fontSize } from '../styles/typography'

const shareIconsSectionCss = css`
    text-align: center;
    margin: ${blockGap} 0;
`

const shareIconWrapperCss = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: ${space.sm};
`

const shareButtonCss = css`
    border-radius: ${radius.full};
    ${hoverTransition(['background-color'], { pressable: true })}

    ${canHover} {
        &:hover {
            background-color: ${surfaceHover};
        }
    }
`

const shareButtonLinkCss = css`
  display: table-cell;
  width: ${space['2xl']};
  height: ${space['2xl']};
  color: ${icon};
  text-align: center;
  vertical-align: middle;
  ${transition(['color'])}
  text-decoration: none;

  & i {
    font-size: ${fontSize.h3};
    vertical-align: middle;
    padding-bottom: 1px;
  }
`

const xCss = css`
    background-color: ${xBlack};
    box-shadow: inset 0 0 0 ${borderWidth.thin} ${brandSurfaceBorder};
    ${shareButtonCss}

    ${canHover} {
        &:hover {
            background-color: ${xBlackHover};
        }
    }
`

const xShareButtonLinkCss = css`
  ${shareButtonLinkCss}

  & i {
    color: ${brandWhite};
  }
`

const xIconCss = css`
  &:before {
    content: "𝕏";
    font-family: Verdana;
    font-weight: bold;
    font-style: normal;
    font-size: ${fontSize.h3};
  }
`

const hatenaCss = css`
    box-shadow: inset 0 0 0 ${borderWidth.thin} ${hatenaBlue};
    ${shareButtonCss}

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

const preferredSourceCss = css`
    display: flex;

    &:not(:has([data-initialized])) {
        display: none;
    }
`

type Props = {
  title: string
  permalink: string
  withPreferredSource?: boolean
}

export function ShareButtons({ title, permalink, withPreferredSource }: Props) {
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
        {withPreferredSource ? (
          <div class={preferredSourceCss} data-preferred-source />
        ) : null}
      </div>
    </section>
  )
}
