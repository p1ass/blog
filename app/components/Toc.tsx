import { css } from 'hono/css'
import { nestToc, type TocItem, type TocNode } from '../lib/toc'
import { accent, text, textMuted } from '../styles/color'
import { hoverUnderlineLinkCss } from '../styles/link'
import { borderWidth } from '../styles/shape'
import { space } from '../styles/spacing'
import { hoverTransition } from '../styles/transition'
import { fontSize, fontWeight, lineHeight } from '../styles/typography'

// data-toc から辿るのは、hono/css のクラス名が中身から作られ、スタイルを直すと変わるため。
// hoverUnderlineLinkCss も transition を持つので、後ろで上書きする。
const tocLinkCss = css`
  display: block;
  padding: ${space['2xs']} ${space.xs};
  border-left: ${borderWidth.thick} solid transparent;
  color: ${textMuted};

  ${hoverUnderlineLinkCss}

  & {
    ${hoverTransition([
      'background-color',
      'border-color',
      'color',
      'text-decoration-color',
      'text-decoration-thickness',
    ])}
  }

  &[aria-current='true'] {
    border-left-color: ${accent};
    color: ${text};
  }
`

const tocListCss = css`
  list-style: none;
  margin: 0;
  padding: 0;

  & li {
    margin: 0;
  }

  /* ブラウザ既定が ul ul に円を当てるので、継承では消えない */
  & li > ul {
    list-style: none;
    margin: 0;
    padding-left: ${space.md};
  }
`

const tocNavCss = css`
  position: sticky;
  top: ${space.lg};
  max-height: calc(100dvh - ${space.xl});
  overflow-y: auto;
  font-size: ${fontSize.bodySmall};
  line-height: ${lineHeight.heading};
`

const tocLabelCss = css`
  margin: 0 0 ${space.xs};
  padding-left: ${space.xs};
  color: ${textMuted};
  font-size: ${fontSize.caption};
  font-weight: ${fontWeight.bold};
`

const tocDetailsCss = css`
  font-size: ${fontSize.bodySmall};
  line-height: ${lineHeight.heading};
`

const labelId = 'toc-label'

type Props = {
  toc: TocItem[]
  // ブラウザでは toc-highlight.ts が動かすので、スタイルガイドの見本でだけ渡す
  currentId?: string
}

function TocList({
  nodes,
  currentId,
}: {
  nodes: TocNode[]
  currentId?: string
}) {
  return (
    <ul class={tocListCss}>
      {nodes.map(node => (
        <li key={node.id}>
          <TocLink item={node} currentId={currentId} />
          {node.children.length > 0 ? (
            <ul>
              {node.children.map(child => (
                <li key={child.id}>
                  <TocLink item={child} currentId={currentId} />
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function TocLink({ item, currentId }: { item: TocItem; currentId?: string }) {
  return (
    <a
      href={`#${item.id}`}
      class={tocLinkCss}
      aria-current={item.id === currentId ? 'true' : undefined}
    >
      {item.text}
    </a>
  )
}

export function TocNav({ toc, currentId }: Props) {
  return (
    <nav class={tocNavCss} data-toc aria-labelledby={labelId}>
      <p class={tocLabelCss} id={labelId}>
        目次
      </p>
      <TocList nodes={nestToc(toc)} currentId={currentId} />
    </nav>
  )
}

// open はスタイルガイドの見本で開いた姿を撮るためにだけ渡す。
export function TocDetails({
  toc,
  currentId,
  open,
}: Props & { open?: boolean }) {
  return (
    <details class={tocDetailsCss} data-toc open={open}>
      <summary>目次</summary>
      <TocList nodes={nestToc(toc)} currentId={currentId} />
    </details>
  )
}
