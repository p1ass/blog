import { css } from 'hono/css'
import { border, gray, white } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'

const paginationCss = css`
  border-top: .5px solid ${border};
  padding-top: 2rem;
  display: inline-flex;
  text-align: center;
  justify-content: space-between;
  width:100%;
  span {
    flex-grow:10;
    font-size: 1.1rem;
  }

  a{
    max-width: 50%;
  }
`

const arrowBoxWidth = '60px'

const arrowCss = css`
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;

  border: solid 1px ${gray};
  color: ${gray};
  border-radius: ${verticalRhythmUnit * 0.25}rem;
  padding: ${verticalRhythmUnit * 0.25}rem 1rem;
  margin: 0 0 0 auto;
  display: flex;
  justify-content: center;
  text-decoration: none;
  &:hover,
  &:focus {
      background-color: ${gray};
      color: ${white};
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
  padding: ${verticalRhythmUnit * 0.25}rem;
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
        <a href={`${basePath ?? ''}/page/${pageNumber - 1}`} class={leftCss}>
          &#8592;
        </a>
      ) : (
        <div class={emptyArrowCss} />
      )}
      <span class={pageNumberCss}>{pageNumber}</span>
      {hasNext ? (
        <a href={`${basePath ?? ''}/page/${pageNumber + 1}`} class={rightCss}>
          &#8594;
        </a>
      ) : null}
    </div>
  )
}
