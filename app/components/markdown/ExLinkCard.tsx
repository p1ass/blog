import { css } from 'hono/css'
import { fetchOgp } from '../../lib/ogp'
import {
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

const cardLinkCss = css`
    text-decoration: none;
    display: flex;
    background-color: ${surface};
    font-size: ${fontSize.caption};
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    height: ${space['4xl']};
    overflow: hidden;
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

    &:hover{
        background-color: ${surfaceSubtle};
    }
    ${transition('0.3s')}

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
  const ogp = await fetchOgp(url)

  return (
    <div class={cardWrapperCss}>
      <a href={url} class={cardLinkCss}>
        {ogp.Image && ogp.Image.length >= 1 ? (
          <div class={thumbnailWrapperCss}>
            <img
              src={ogp.Image[0].URL}
              class={thumbnailImageCss}
              alt={ogp.Title}
            />
          </div>
        ) : null}
        <div class={entryBodyCss}>
          <p>{ogp.Title}</p>
          <div class={entryDescriptionCss}>{ogp.Description}</div>
          <span class={entryHostUrlCss}>{new URL(url).host}</span>
        </div>
      </a>
    </div>
  )
}
