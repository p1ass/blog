import { css } from 'hono/css'
import { accent, accentMuted, surfaceSubtle } from './color'
import { canHover } from './motion'
import { hoverTransition } from './transition'
import { underline } from './typography'

// border-bottom は折り返した行に線が乗らないので、text-decoration で引く。
// ショートハンドの text-decoration は、取り込む側が先に指定した text-decoration-color を初期値に戻すので書かない。
const underlineCss = css`
  text-decoration-line: underline;
  text-decoration-thickness: ${underline.thickness};
  text-underline-offset: ${underline.offset};

  ${hoverTransition([
    'background-color',
    'text-decoration-color',
    'text-decoration-thickness',
  ])}

  ${canHover} {
    &:hover {
      background-color: ${surfaceSubtle};
      text-decoration-thickness: ${underline.hoverThickness};
    }
  }
  &:focus-visible {
    background-color: ${surfaceSubtle};
    text-decoration-thickness: ${underline.hoverThickness};
  }
`

// 色だけでは色覚特性によって地の文と見分けられないので、下線を常に引く。
export const bodyLinkCss = css`
  color: ${accent};
  text-decoration-color: ${accentMuted};
  ${underlineCss}

  ${canHover} {
    &:hover {
      text-decoration-color: ${accent};
    }
  }
  &:focus-visible {
    text-decoration-color: ${accent};
  }
`

// text-decoration の有無は補間できず hover で線が急に現れるので、下線は常に引いて色を transparent から変える。
export const hoverUnderlineLinkCss = css`
  text-decoration-color: transparent;
  ${underlineCss}

  ${canHover} {
    &:hover {
      text-decoration-color: currentColor;
    }
  }
  &:focus-visible {
    text-decoration-color: currentColor;
  }
`
