import { css } from 'hono/css'
import {
  brandWhite,
  hatenaBlue,
  xBlack,
  xBlackHover,
  xSurfaceHover,
} from '../styles/brand'
import { brandSurfaceBorder, icon, surfaceHover } from '../styles/color'
import { borderWidth, radius } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize } from '../styles/typography'

const shareIconsSectionCss = css`
    text-align: center;
    margin: ${blockGap} 0;
`

const shareIconWrapperCss = css`
    display: inline-block;
    text-align: left;
`

const shareButtonCss = css`
    float: left;
    border-radius: ${radius.full};
    ${transition(['box-shadow', 'background-color'])}

    margin: 0 0 0 ${space.sm};

    &:hover {
        box-shadow: inset 0 0 0 22px ${surfaceHover};
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

// 円は純黒で暗い地では輪郭が消える。border だと円が 2px 広がるので、境界は box-shadow で描く。
const xCss = css`
    background-color: ${xBlack};
    box-shadow: inset 0 0 0 ${borderWidth.thin} ${brandSurfaceBorder};
    ${shareButtonCss}

    &:hover {
        box-shadow: inset 0 0 0 ${borderWidth.thin} ${brandSurfaceBorder}, inset 0 0 0 22px ${xBlackHover};
        background-color: ${xSurfaceHover};
    }
`

// 𝕏 は黒い円の上に置くので、テーマによらず白で描画する。
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

// はてなブックマークのロゴそのものなので、コントラストが足りなくてもブランドカラーで描く (WCAG 1.4.3 の対象外)。
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

type Props = {
  title: string
  permalink: string
}

export function ShareButtons({ title, permalink }: Props) {
  // タイトルに # を含む記事がある
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
