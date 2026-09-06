import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'
import type { MDXComponents } from 'mdx/types'
import { BlockLink } from '../components/markdown/BlockLink'
import { ExLinkCard } from '../components/markdown/ExLinkCard'
import { Note } from '../components/markdown/Note'
import { StyledPre } from '../components/markdown/StyledPre'
import { Twitter } from '../components/markdown/Twitter'
import { accent, border, surfaceSubtle, textMuted } from '../styles/color'
import { borderWidth } from '../styles/shape'
import { blockGap, space } from '../styles/spacing'
import { fontSize } from '../styles/typography'

export function useMDXComponents(): MDXComponents {
  const components = {
    img: Image,
    pre: StyledPre,
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

const imageCss = css`
  display: block;
  max-height: 500px;
  max-width: 100%;
  margin: 0 auto;
  border: ${borderWidth.thin} solid ${border};
`

export function Image(props: PropsWithChildren<Hono.ImgHTMLAttributes>) {
  // 本番ビルドでは viteStaticCopy が画像をコピーするので、その配置に合わせたパスを返す
  const src = import.meta.env.PROD
    ? props.src?.replaceAll('/app/routes', '')
    : props.src

  return (
    <a href={src}>
      <img src={src} alt={props.alt} class={imageCss} />
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

const linkCss = css`
  color: ${accent};
`

function Link(props: PropsWithChildren<Hono.AnchorHTMLAttributes>) {
  return (
    <a href={props.href} class={linkCss}>
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

function Table(props: PropsWithChildren<Hono.TableHTMLAttributes>) {
  return (
    <table class={tableCss} align={props.align}>
      {props.children}
    </table>
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
