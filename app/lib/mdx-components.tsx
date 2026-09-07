import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import type { MDXComponents } from 'mdx/types'
import { BlockLink } from '../components/markdown/BlockLink'
import { ExLinkCard } from '../components/markdown/ExLinkCard'
import { Note } from '../components/markdown/Note'
import { Twitter } from '../components/markdown/Twitter'
import { accent, border, surfaceSubtle, textMuted } from '../styles/color'
import { bodyLinkCss } from '../styles/link'
import { borderWidth } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { transition } from '../styles/transition'
import { fontSize } from '../styles/typography'

export function useMDXComponents(): MDXComponents {
  const components = {
    img: Image,
    blockquote: BlockQuote,
    a: Link,
    em: Em,
    table: Table,
    th: Th,
    td: Td,
    ExLinkCard: ExLinkCard,
    BlockLink: BlockLink,
    Note: Note,
    Twitter: Twitter,
  }
  // @ts-expect-error
  return components
}

// height: auto は width と height の属性と組で置く。
// 属性はプレゼンテーション上のヒントとして CSS の width と height に反映されるので、これが無いと max-width で横だけ縮んで画像が縦に潰れる。
//
// max-height はもう書かない。縦に長い画像を抑える計算は rehype-image-size.ts が済ませていて、属性の値が既に上限に収まっている。
// ここに残すと、属性で決まった横幅はそのままに高さだけが詰まり、やはり潰れる。
const imageCss = css`
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  border: ${borderWidth.thin} solid ${border};

  ${transition(['border-color'])}
`

// 画像は押すと原寸で開く。それが分かるように、hover で枠を accent にする。
// リンク側に display を足すと配置が動くので、枠の色だけを変える。
const imageLinkCss = css`
  &:hover img,
  &:focus-visible img {
    border-color: ${accent};
  }
`

export function Image(props: PropsWithChildren<Hono.ImgHTMLAttributes>) {
  // 本番ビルドでは viteStaticCopy が画像をコピーするので、その配置に合わせたパスを返す
  const src = import.meta.env.PROD
    ? props.src?.replaceAll('/app/routes', '')
    : props.src

  return (
    <a href={src} class={imageLinkCss}>
      <img
        src={src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        class={imageCss}
      />
    </a>
  )
}

const blockQuoteCss = css`
  border-left: ${borderWidth.thick} solid ${border};
  color: ${textMuted};
  margin: 0 0 ${blockGap};
  padding: 0 0 0 ${space.md};

  p:last-child {
    margin-bottom: 0;
  }
`

function BlockQuote(props: PropsWithChildren<Hono.BlockquoteHTMLAttributes>) {
  return (
    <blockquote class={blockQuoteCss} cite={props.cite}>
      {props.children}
    </blockquote>
  )
}

function Link(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <a href={props.href} class={bodyLinkCss}>
      {props.children}
    </a>
  )
}

const emCss = css`
  color: ${textMuted};
  display: block;
  font-size: ${fontSize.bodySmall};
  font-style: normal;
  text-align: center;
`

function Em(props: PropsWithChildren<Hono.HTMLAttributes>) {
  return <em class={emCss}>{props.children}</em>
}

const tableCss = css`
  border-spacing: 0;
  border-collapse: collapse;

  & tr:nth-child(odd) td {
    background: ${surfaceSubtle};
  }
`

// 表は横スクロールするラッパーで囲む。列の多い表は本文幅を超え、ページ全体を横に伸ばす。
const tableWrapperCss = css`
  overflow-x: auto;
  margin: 0 0 ${blockGap};
`

function Table(props: PropsWithChildren<Hono.TableHTMLAttributes>) {
  return (
    <div class={tableWrapperCss}>
      <table class={tableCss} align={props.align}>
        {props.children}
      </table>
    </div>
  )
}

const thTdCss = css`
  border: solid ${borderWidth.thin} ${border};
  padding: ${space.xs} ${space.sm};
`

function Th(props: PropsWithChildren<Hono.ThHTMLAttributes>) {
  return (
    <th class={thTdCss} align={props.align}>
      {props.children}
    </th>
  )
}

function Td(props: PropsWithChildren<Hono.TdHTMLAttributes>) {
  return (
    <td class={thTdCss} align={props.align}>
      {props.children}
    </td>
  )
}
