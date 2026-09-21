import { css } from 'hono/css'
import { accent, accentMuted, surfaceSubtle } from './color'
import { canHover } from './motion'
import { hoverTransition } from './transition'
import { underline } from './typography'

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
