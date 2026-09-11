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
import { borderWidth, radius } from '../../styles/shape'
import { blockGap, space } from '../../styles/spacing'
import { transition } from '../../styles/transition'
import { fontSize, lineHeight } from '../../styles/typography'

// OGP の画像の事実上の標準である 1200×630 (1.91:1)。キャッシュにある画像の 9 割がこの比に近い。
const thumbnailAspectRatio = '1200 / 630'

// 広い画面でのカードの高さ。タイトル 2 行、説明 1 行、ホスト名を積むと約 78px で、上下の padding を足すと約 102px になる。
// 以前は 96px に固定していたので、タイトルが 2 行に折り返すとホスト名が切れていた。10px ほど余裕を持たせた。
const cardHeight = '112px'

// 狭い画面でのサムネイルの幅。高さは 59px で、タイトル 2 行とホスト名を積んだ高さ (約 62px) とほぼ同じになる。
const thumbnailWidthNarrow = '112px'

const cardWrapperCss = css`
    margin-bottom: ${blockGap};
`

// hover はカード全体で受ける。以前は本文の領域だけが反応していたので、サムネイルの上にカーソルを置いても何も起きなかった。
// 面もカード全体に敷く。狭い画面ではサムネイルの周りに余白があり、本文の領域だけに敷くとそこが抜ける。
//
// どちらの幅でもサムネイルは右に置く。
// 狭い画面では小さく内側に置き、高さは中身に任せる。上に全幅で置くと、1 枚で画面の 4 割を占めた。
// 本文の領域はカードの高さまで伸ばし、タイトルの上端とホスト名の下端をサムネイルの上下にそろえる。タイトルが 1 行でも 2 行でも、カードの高さがほぼ変わらない。
// 広い画面ではカードの高さいっぱいに置き、高さを固定する。リンクカードが続いたときに高さがそろう。
const cardLinkCss = css`
    text-decoration: none;
    display: flex;
    background-color: ${surface};
    font-size: ${fontSize.caption};
    border: ${borderWidth.thin} solid ${border};
    border-radius: ${radius.md};
    overflow: hidden;

    ${transition(['border-color', 'background-color'])}

    &:hover,
    &:focus-visible {
        border-color: ${accent};
        background-color: ${surfaceSubtle};
    }

    ${mediaUp('sm')} {
        height: ${cardHeight};
    }
`

// 狭い画面では、右と上下に本文の padding と同じ余白を取る。左は本文の padding がそのまま間隔になる。
// 伸ばすと比が崩れるので、カードの高さには合わせない。
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

// 狭い画面では出さない。1 行に 12 文字ほどしか入らず、書き出しの数語で切れて中身が読み取れない。
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

// 行間を本文から継がせると 24px 近くになり、固定したカードの高さに収まらなくなる。
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
        {/* リンクの名前はタイトルの文字で足りる。alt にもタイトルを入れると、読み上げで 2 回続く。 */}
        {ogp.image ? <img src={ogp.image} class={thumbnailCss} alt='' /> : null}
      </a>
    </div>
  )
}
