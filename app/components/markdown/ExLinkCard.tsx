import { css, cx } from 'hono/css'
import { getOgp } from '../../lib/ogp'
import {
  accent,
  border,
  surface,
  surfaceSubtle,
  text,
  textMuted,
} from '../../styles/color'
import { borderWidth, radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'
import { transition } from '../../styles/transition'
import { fontSize, lineHeight } from '../../styles/typography'

const cardWrapperCss = css`
    margin-bottom: ${blockGap};
`

// hover はカード全体で受ける。以前は本文の領域だけが反応していたので、サムネイルの上にカーソルを置いても何も起きなかった。
//
// 中の要素は素のクラス名で指す。hono/css のクラスを ${...} でセレクタに差し込むと、クラス名ではなく中身の宣言が展開されることもある。展開された規則は全体が読めなくなる。
const cardLinkCss = css`
    text-decoration: none;
    display: flex;
    background-color: ${surface};
    font-size: ${fontSize.caption};
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    height: ${space['4xl']};
    overflow: hidden;

    ${transition(['border-color'])}

    &:hover,
    &:focus-visible {
        border-color: ${accent};
    }

    &:hover .entry-body,
    &:focus-visible .entry-body {
        background-color: ${surfaceSubtle};
    }
`

const thumbnailWrapperCss = css`
    width: ${space['4xl']};
    height: ${space['4xl']};
`

const thumbnailImageCss = css`
    border: none;
    margin: 0;
    object-fit:cover;
    height:100%;
    width: 100%;
`

const entryBodyCss = css`
    color: ${text};
    display: flex;
    justify-content: space-between;
    flex: 1;
    flex-direction: column;
    padding: ${space.sm};

    ${transition(['background-color'])}

    & p {
      font-size: ${fontSize.bodySmall};
      margin: 0 0 ${space.xs} 0;
      line-height: ${lineHeight.tight};
      width:100%;
      max-height: 47px;
      overflow: hidden;
      font-weight: bold;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      
    }
`

const entryDescriptionCss = css`
    color: ${textMuted};
    font-size: ${fontSize.caption};
    max-height: ${space['2xl']};
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: ${lineHeight.tight};
`

const entryHostUrlCss = css`
    color: ${textMuted};
    font-size: ${fontSize.caption};
`

type Props = {
  url: string
}

export async function ExLinkCard({ url }: Props) {
  const ogp = await getOgp(url)

  return (
    <div class={cardWrapperCss}>
      <a href={url} class={cardLinkCss}>
        {ogp.image ? (
          <div class={thumbnailWrapperCss}>
            <img src={ogp.image} class={thumbnailImageCss} alt={ogp.title} />
          </div>
        ) : null}
        <div class={cx(entryBodyCss, 'entry-body')}>
          <p>{ogp.title}</p>
          <div class={entryDescriptionCss}>{ogp.description}</div>
          <span class={entryHostUrlCss}>{new URL(url).host}</span>
        </div>
      </a>
    </div>
  )
}
