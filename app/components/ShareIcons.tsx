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

// 円は純黒なので、暗い地では輪郭が消える。境界を box-shadow で描くのは、円の大きさを変えずに済ませるため。
// border だと明るいテーマでも 2px 広がる。透明な境界も場所は取るので、見た目が変わらないのは box-shadow のほうだけ。
// hover の 22px の影は円を塗りつぶすので、境界を先に書いて上に残す。
//
// 入れ子の規則を持つ ${...} は最後に置く。その後ろに書いた宣言は入れ子の外へ出て捨てられる。
const xCss = css`
    background-color: ${xBlack};
    box-shadow: inset 0 0 0 ${borderWidth.thin} ${brandSurfaceBorder};
    ${shareButtonCss}

    &:hover {
        box-shadow: inset 0 0 0 ${borderWidth.thin} ${brandSurfaceBorder}, inset 0 0 0 22px ${xBlackHover};
        background-color: ${xSurfaceHover};
    }
`

// 𝕏 は黒い円の上に置くので、テーマによらず白のまま。textInverted だと暗いテーマで文字まで暗くなり、円に沈む。
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
    font-size: 1.5rem;
  }
`

// ボタンの文字は白地で 2.79 対 1 だが、これははてなブックマークのロゴそのものなので、そのままブランドカラーで描く。
// WCAG 1.4.3 はロゴやブランド名の一部であるテキストをコントラストの対象から外している。
// 読みやすさのために色を動かすと、見分けるための手がかりのほうを失う。
const hatenaCss = css`
    box-shadow: inset 0 0 0 0.1rem ${hatenaBlue};
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
