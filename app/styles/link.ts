import { css } from 'hono/css'
import { accent, accentMuted, surfaceSubtle } from './color'
import { transition } from './transition'
import { underline } from './typography'

// リンクの下線は border-bottom ではなく text-decoration で引く。border-bottom はリンクの箱に付くので、折り返した行に線が乗らない。
//
// hover では下線を太くし、あわせてリンクの背後に薄い面を敷く。1px の線の色だけを変えても、指しているかどうかが分からない。
//
// 文字の色は動かさない。accent は白地で 4.91 対 1 しかなく、1 段薄い accent の 400 にすると本文の 4.5 対 1 を割る。
// ヘッダーや筆者のリンクが hover で薄くできているのは、text が 15 対 1 近くあって余裕があるため。
// ショートハンドの text-decoration は書かない。text-decoration-color を初期値に戻すので、これを取り込む側が先に色を指定していると、その指定が消える。
const underlineCss = css`
  text-decoration-line: underline;
  text-decoration-thickness: ${underline.thickness};
  text-underline-offset: ${underline.offset};

  ${transition([
    'background-color',
    'text-decoration-color',
    'text-decoration-thickness',
  ])}

  &:hover,
  &:focus-visible {
    background-color: ${surfaceSubtle};
    text-decoration-thickness: ${underline.hoverThickness};
  }
`

// 文章の中に置くリンク。記事本文と一覧の抜粋、BlockLink がこれを使う。
//
// 下線は常に引いておく。色だけで見分けさせると、色覚特性によっては地の文と区別が付かない。
// 平常時は薄く引いて文章の流れを止めず、hover と focus で accent まで濃くする。
export const bodyLinkCss = css`
  color: ${accent};
  text-decoration-color: ${accentMuted};
  ${underlineCss}

  &:hover,
  &:focus-visible {
    text-decoration-color: ${accent};
  }
`

// 文章の中ではない、それ自体が 1 つの部品として置かれるリンク。前後の記事へのリンクとフッターがこれを使う。
//
// 独立して並んでいるので、押せることは位置と色で分かる。平常時に下線を出すと、文字の下に線が並ぶだけになる。
// 下線そのものは常に引いておき、色を transparent から currentColor に変える。text-decoration の有無は補間できず、hover した瞬間に線が現れて文字が跳ねて見える。
export const hoverUnderlineLinkCss = css`
  text-decoration-color: transparent;
  ${underlineCss}

  &:hover,
  &:focus-visible {
    text-decoration-color: currentColor;
  }
`
