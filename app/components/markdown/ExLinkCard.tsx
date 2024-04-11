import { css } from 'hono/css'
import { fetchOgp } from '../../lib/ogp'
import { backgroundDark, gray, grayLight, white } from '../../styles/color'
import { transition } from '../../styles/transition'
import { verticalRhythmUnit } from '../../styles/variables'
const cardWrapperCss = css`
    margin-bottom: ${verticalRhythmUnit}rem;
`

const cardLinkCss = css`
    text-decoration: none;
    display: flex;
    background-color: ${white};
    font-size: 13px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: ${verticalRhythmUnit * 0.5}rem;
    height: ${verticalRhythmUnit * 5}rem;
    overflow: hidden;
`

const thumbnailWrapperCss = css`
    width: ${verticalRhythmUnit * 5}rem;
    height: ${verticalRhythmUnit * 5}rem;
`

const thumbnailImageCss = css`
    border: none;
    margin: 0;
    object-fit:cover;
    height:100%;
    width: 100%;
`

const entryBodyCss = css`
    color: ${gray};
    display: flex;
    justify-content: space-between;
    flex: 1;
    flex-direction: column;
    padding: ${verticalRhythmUnit * 0.5}rem;

    &:hover{
        background-color: ${backgroundDark};
    }
    ${transition(0.3)}

    & p {
      font-size: 17px;
      margin: 0 0 ${verticalRhythmUnit * 0.5}rem 0;
      line-height: ${verticalRhythmUnit * 0.75}rem;
      width:100%;
      max-height: 47px;
      overflow: hidden;
      font-weight: bold;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      
      @media (max-width: 600px) {
          font-size: 14px;
          margin: 0 0 ${verticalRhythmUnit * 0.5}rem 0;
      }
    }
`

const entryDescriptionCss = css`
    color: ${grayLight};
    font-size: 12px;
    max-height: ${verticalRhythmUnit * 2}rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: ${verticalRhythmUnit * 0.75}rem;
`

const entryHostUrlCss = css`
    color: ${grayLight};
    font-size: 12px; 
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
