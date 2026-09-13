import { css } from 'hono/css'
import { border, text, textInverted } from '../styles/color'
import { canHover } from '../styles/motion'
import { borderWidth, radius } from '../styles/shape'
import { space } from '../styles/spacing'
import { hoverTransition } from '../styles/transition'
import { fontSize } from '../styles/typography'

const paginationCss = css`
  border-top: ${borderWidth.thin} solid ${border};
  padding-top: ${space.xl};
  display: inline-flex;
  text-align: center;
  justify-content: space-between;
  width:100%;
  & span {
    flex-grow:10;
    font-size: ${fontSize.body};
  }

  & a {
    max-width: 50%;
  }
`

const arrowBoxWidth = '60px'

const arrowCss = css`
  ${hoverTransition(['background-color', 'color'], { pressable: true })}

  border: solid ${borderWidth.thin} ${text};
  color: ${text};
  border-radius: ${radius.sm};
  padding: ${space.xs} ${space.md};
  margin: 0 0 0 auto;
  display: flex;
  justify-content: center;
  text-decoration: none;
  ${canHover} {
    &:hover {
      background-color: ${text};
      color: ${textInverted};
    }
  }
  &:focus-visible {
      background-color: ${text};
      color: ${textInverted};
  }
`

const leftCss = css`
    text-align: left;
    ${arrowCss}
`
const rightCss = css`
    text-align: right;
    ${arrowCss}
`

const emptyArrowCss = css`
  width: ${arrowBoxWidth}; 
`

const pageNumberCss = css`
  padding: ${space.xs};
`

type Props = {
  pageNumber: number

  hasPrev: boolean
  hasNext: boolean

  basePath?: string
}

export function Pagination({ pageNumber, hasPrev, hasNext, basePath }: Props) {
  return (
    <div class={paginationCss}>
      {hasPrev ? (
        <a
          href={`${basePath ?? ''}/page/${pageNumber - 1}/`}
          class={leftCss}
          data-direction='previous'
        >
          &#8592;
        </a>
      ) : (
        <div class={emptyArrowCss} />
      )}
      <span class={pageNumberCss}>{pageNumber}</span>
      {hasNext ? (
        <a
          href={`${basePath ?? ''}/page/${pageNumber + 1}/`}
          class={rightCss}
          data-direction='next'
        >
          &#8594;
        </a>
      ) : null}
    </div>
  )
}
