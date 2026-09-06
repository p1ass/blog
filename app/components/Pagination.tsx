import { css } from 'hono/css'
import { border, text, textInverted } from '../styles/color'
import { borderWidth, radius } from '../styles/shape'
import { space } from '../styles/spacing'
import { transition } from '../styles/transition'
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
  ${transition('0.2s')}

  border: solid ${borderWidth.thin} ${text};
  color: ${text};
  border-radius: ${radius.sm};
  padding: ${space.xs} ${space.md};
  margin: 0 0 0 auto;
  display: flex;
  justify-content: center;
  text-decoration: none;
  &:hover,
  &:focus {
      background-color: ${text};
      color: ${textInverted};
  }  
`

const leftCss = css`
    ${arrowCss}
    text-align: left;
`
const rightCss = css`
    ${arrowCss}
    text-align: right;
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
        <a href={`${basePath ?? ''}/page/${pageNumber - 1}/`} class={leftCss}>
          &#8592;
        </a>
      ) : (
        <div class={emptyArrowCss} />
      )}
      <span class={pageNumberCss}>{pageNumber}</span>
      {hasNext ? (
        <a href={`${basePath ?? ''}/page/${pageNumber + 1}/`} class={rightCss}>
          &#8594;
        </a>
      ) : null}
    </div>
  )
}
