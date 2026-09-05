import { css } from 'hono/css'
import { Fragment } from 'hono/jsx/jsx-runtime'
import {
  getLabels,
  type LabelKind,
  labelHeadingPrefix,
  labelPermalink,
} from '../lib/posts'
import { blue } from '../styles/color'
import { Heading } from './Heading'

const linkCss = css`
  color: ${blue};
  text-decoration: none;
`

type Props = {
  kind: LabelKind
}

export function LabelIndexPage({ kind }: Props) {
  const heading = `${labelHeadingPrefix[kind]}s`

  return (
    <Fragment>
      <Heading>{heading}</Heading>
      <ul>
        {getLabels(kind).map(label => (
          <li>
            <a href={labelPermalink(kind, label.id)} class={linkCss}>
              {label.name}
            </a>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}
