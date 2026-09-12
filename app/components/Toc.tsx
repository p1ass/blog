import { css } from 'hono/css'
import { nestToc, type TocItem, type TocNode } from '../lib/toc'
import { accent, text, textMuted } from '../styles/color'
import { hoverUnderlineLinkCss } from '../styles/link'
import { borderWidth } from '../styles/shape'
import { space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize, fontWeight, lineHeight } from '../styles/typography'

// 記事の目次。広い画面では本文の右に添え、狭い画面では冒頭の折りたたみとして出す。
// どちらを見せるかは app/routes/posts/_renderer.tsx が決める。ここは見た目だけを持つ。
//
// リンクの当たり判定は行の幅いっぱいに取る。文字の上だけが反応すると、押せる範囲が
// 見た目より狭く感じられる。
//
// 今いる節を示すのは、左の線と文字の濃さの 2 つ。濃さだけだと、色の違いを読み取れない読者に伝わらない。
// 線の色を付け外しするのではなく、透明から accent へ変える。太さが変わると行がずれる。
//
// 目次の並びは data-toc から辿る。クラス名は hono/css が内容から作るので、
// ブラウザ側のコードから指しても、スタイルを直した拍子に外れる。
const tocLinkCss = css`
  display: block;
  padding: ${space['2xs']} ${space.xs};
  border-left: ${borderWidth.thick} solid transparent;
  color: ${textMuted};

  ${transition(['border-color', 'color'])}

  ${hoverUnderlineLinkCss}

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

  /* 入れ子のリストの印はブラウザ既定が ul ul に円を当てるので、継承では消えない */
  & li > ul {
    list-style: none;
    margin: 0;
    padding-left: ${space.md};
  }
`

// 見出しが多い記事では、目次だけで画面の高さを超える。超えたぶんは目次の中でスクロールさせる。
// 今いる節が隠れたままにならないよう、app/lib/toc-highlight.ts がここの位置を合わせる。
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

// 折りたたみの見た目は記事本文の details と同じものを使う。目次のためだけに別の
// 囲みを作ると、同じ記事の中に似て非なる箱が 2 種類並ぶ。
const tocDetailsCss = css`
  font-size: ${fontSize.bodySmall};
  line-height: ${lineHeight.heading};
`

const labelId = 'toc-label'

type Props = {
  toc: TocItem[]
  // 今いる節。ブラウザでは toc-highlight.ts が動かすので、スタイルガイドの見本でだけ渡す
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

// 本文の右に添える目次。
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

// 本文の右に置けない画面幅で、記事の冒頭に出す折りたたみ。
// 記事では畳んで出す。open を立てるのは、開いた姿を撮るスタイルガイドの見本だけ。
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
