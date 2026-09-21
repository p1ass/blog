import { css } from 'hono/css'
import { getOgp } from '../../lib/ogp'
import { mediaUp } from '../../styles/breakpoint'
import {
  accent,
  border,
  surface,
  surfaceSubtle,
  text,
  textMuted,
} from '../../styles/color'
import { canHover } from '../../styles/motion'
import { borderWidth, radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'
import { hoverTransition } from '../../styles/transition'
import { fontSize, lineHeight } from '../../styles/typography'

const thumbnailAspectRatio = '1200 / 630'

const cardHeight = '112px'

const thumbnailWidthNarrow = '112px'

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
    overflow: hidden;

    ${hoverTransition(['border-color', 'background-color'])}

    ${canHover} {
        &:hover {
            border-color: ${accent};
            background-color: ${surfaceSubtle};
        }
    }
    &:focus-visible {
        border-color: ${accent};
        background-color: ${surfaceSubtle};
    }

    ${mediaUp('sm')} {
        height: ${cardHeight};
    }
`

const thumbnailCss = css`
    display: block;
    flex: none;
    align-self: flex-start;
    width: ${thumbnailWidthNarrow};
    aspect-ratio: ${thumbnailAspectRatio};
    object-fit: cover;
    border: none;
    border-radius: ${radius.sm};
    margin: ${space.sm} ${space.sm} ${space.sm} 0;

    ${mediaUp('sm')} {
        width: auto;
        height: 100%;
        border-radius: 0;
        margin: 0;
    }
`

const entryBodyCss = css`
    color: ${text};
    display: flex;
    justify-content: space-between;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: ${space.sm};

    & p {
      font-size: ${fontSize.bodySmall};
      margin: 0 0 ${space.xs} 0;
      line-height: ${lineHeight.tight};
      overflow: hidden;
      font-weight: bold;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
`

const entryDescriptionCss = css`
    display: none;
    color: ${textMuted};
    font-size: ${fontSize.caption};
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: ${lineHeight.tight};

    ${mediaUp('sm')} {
        display: -webkit-box;
    }
`

const entryHostUrlCss = css`
    color: ${textMuted};
    font-size: ${fontSize.caption};
    line-height: ${lineHeight.tight};
`

type Props = {
  url: string
}

export async function ExLinkCard({ url }: Props) {
  const ogp = await getOgp(url)

  return (
    <div class={cardWrapperCss}>
      <a href={url} class={cardLinkCss}>
        <div class={entryBodyCss}>
          <p>{ogp.title}</p>
          <div class={entryDescriptionCss}>{ogp.description}</div>
          <span class={entryHostUrlCss}>{new URL(url).host}</span>
        </div>
        {ogp.image ? <img src={ogp.image} class={thumbnailCss} alt='' /> : null}
      </a>
    </div>
  )
}
